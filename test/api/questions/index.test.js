/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../../pages/api/questions/index.js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(async () => {
  await prisma.$executeRaw('TRUNCATE TABLE question_urls CASCADE;');
  await prisma.$disconnect();
});

describe('GET /api/questions', () => {
  beforeAll(async () => {
    await prisma.question_urls.create({
      data: {
        url: 'https://overriddenurl.com',
        question_id: 1,
        department_id: 1,
      },
    });
  });

  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(401);
      },
    });
  });

  it('returns questions', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.likert_scale.length).toEqual(7);
        expect(json.words.length).toEqual(2);
      },
    });
  });

  it("obeys 'default' filter", async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      requestPatcher: req => (req.url = '/api/questions?default_urls=1'),
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        // Ensure the returned URL is NOT the overriden URL
        expect(json.likert_scale.find(q => q.id === 1).url).not.toEqual(
          'https://overriddenurl.com'
        );
      },
    });
  });

  it('returns overriden URLs by default', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        // Ensure the returned URL IS the overriden URL by default
        expect(json.likert_scale.find(q => q.id === 1).url).toEqual(
          'https://overriddenurl.com'
        );
      },
    });
  });
});

describe('POST /api/questions', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'POST' });
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
    it(`doesn't allow ${userType} users to add a new question`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: '',
          });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/questions',
            'post'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows admins to add a new question', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            body: 'Test question',
            url: 'https://example.com',
            standard: 1,
            type: 'likert_scale',
          }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions',
          'post'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);
      },
    });
  });

  it('validates request bodies', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ standard: 1 }),
        });
        expect(res.status).toBe(422);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/questions',
          'post'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });
});

describe('Invalid HTTP methods for /api/questions', () => {
  ['DELETE', 'PUT'].forEach(methodType => {
    it(`doesn't allow ${methodType} requests`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: methodType });
          expect(res.status).toBe(405);
        },
      });
    });
  });
});
