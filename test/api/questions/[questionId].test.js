/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../../pages/api/questions/[questionId].js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

beforeAll(async () => {
  await prisma.questions.create({
    data: {
      body: 'test',
      default_url: 'https://example.com',
      type: 'words',
      archived: false,
      id: 100,
      standard_id: 1,
    },
  });
});

afterAll(async () => {
  await prisma.$executeRaw('DELETE FROM questions WHERE id=100;');
  await prisma.$disconnect();
});

describe('PUT /api/questions/{id}', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'PUT' });
        expect(res.status).toBe(401);
      },
    });
  });

  [
    Roles.USER_TYPE_CLINICIAN,
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to update questions`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        params: { questionId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/questions/{id}',
            'put'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows admins to update questions', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ body: 'test2', url: 'https://example.com' }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions/{id}',
          'put'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const newQuestion = await prisma.questions.findFirst({
          select: { body: true, default_url: true },
          where: { id: { equals: 100 } },
        });
        expect(newQuestion.body).toEqual('test2');
        expect(newQuestion.default_url).toEqual('https://example.com');
      },
    });
  });

  it('validates request paths', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      params: { questionId: 'foo' },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
        expect(res.status).toBe(422);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions/{id}',
          'put'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });

  it('validates request bodies', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
        });
        expect(res.status).toBe(422);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions/{id}',
          'put'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });
});

describe('DELETE /api/questions/{id}', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(401);
      },
    });
  });

  [
    Roles.USER_TYPE_CLINICIAN,
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to archive/delete questions`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        params: { questionId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/questions/{id}',
            'delete'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows admins to archive/delete questions', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions/{id}',
          'delete'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const newArchivedStatus = await prisma.questions.findFirst({
          select: { archived: true },
          where: { id: { equals: 100 } },
        });
        expect(newArchivedStatus.archived).toEqual(true);
      },
    });
  });
});

describe('Invalid HTTP methods for /api/questions/{id}', () => {
  ['GET', 'POST'].forEach(methodType => {
    it(`doesn't allow ${methodType} requests`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        params: { questionId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({ method: methodType });
          expect(res.status).toBe(405);
        },
      });
    });
  });
});
