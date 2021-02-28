/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, {
  config,
} from '../../../pages/api/question_urls/[questionId].js';
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
  await prisma.$executeRaw('DELETE FROM question_urls WHERE question_id=100;');
  await prisma.$executeRaw('DELETE FROM questions WHERE id=100;');
  await prisma.$disconnect();
});

describe('PUT /api/question_urls/{id}', () => {
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
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to update department-specific question URLs`, async () => {
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
            '/question_urls/{id}',
            'put'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows department managers to update department-specific question URLs', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT, 1);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ url: 'https://overriddenurl.com' }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/question_urls/{id}',
          'put'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const newUrl = await prisma.question_urls.findFirst({
          select: { url: true },
          where: {
            AND: { question_id: { equals: 100 }, department_id: { equals: 1 } },
          },
        });
        expect(newUrl.url).toEqual('https://overriddenurl.com');
      },
    });
  });

  it('validates request bodies', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT);
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
          '/question_urls/{id}',
          'put'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });
});

describe('DELETE /api/question_urls/{id}', () => {
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
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to delete department-specific question URLs`, async () => {
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
            '/question_urls/{id}',
            'delete'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows department managers to delete department-specific question URLs', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT);
    await testApiHandler({
      handler,
      params: { questionId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/question_urls/{id}',
          'delete'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const newUrl = await prisma.question_urls.findFirst({
          select: { url: true },
          where: {
            AND: { question_id: { equals: 100 }, department_id: { equals: 1 } },
          },
        });
        expect(newUrl).toBe(null);
      },
    });
  });
});
