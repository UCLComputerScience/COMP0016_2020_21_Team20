/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../pages/api/responses';
import { Roles } from '../../lib/constants';
import prisma from '../../lib/prisma';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(async () => {
  await prisma.$executeRaw('TRUNCATE TABLE responses CASCADE;');
  await prisma.$disconnect();
});

describe('GET /api/responses', () => {
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

  it('returns no responses', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/responses'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.responses.length).toEqual(0);
        expect(Object.keys(json.averages).length).toEqual(0);
      },
    });
  });

  describe('returns responses for correct user', () => {
    beforeAll(async () => {
      await prisma.responses.create({
        data: {
          users: { connect: { id: 'clinician' } },
          is_mentoring_session: false,
          timestamp: new Date(),
          departments: { connect: { id: 1 } },
          scores: {
            create: [
              { score: 0, standards: { connect: { id: 1 } } },
              { score: 1, standards: { connect: { id: 2 } } },
              { score: 2, standards: { connect: { id: 3 } } },
              { score: 3, standards: { connect: { id: 4 } } },
              { score: 4, standards: { connect: { id: 5 } } },
              { score: 3, standards: { connect: { id: 6 } } },
              { score: 2, standards: { connect: { id: 7 } } },
            ],
          },
          words: {
            create: [
              { word: 'satisfying', questions: { connect: { id: 8 } } },
              { word: 'complex', questions: { connect: { id: 9 } } },
            ],
          },
        },
      });

      await prisma.responses.create({
        data: {
          users: { connect: { id: 'clinician' } },
          is_mentoring_session: true,
          timestamp: new Date(),
          departments: { connect: { id: 1 } },
          scores: {
            create: [
              { score: 0, standards: { connect: { id: 1 } } },
              { score: 1, standards: { connect: { id: 2 } } },
              { score: 2, standards: { connect: { id: 3 } } },
              { score: 3, standards: { connect: { id: 4 } } },
              { score: 4, standards: { connect: { id: 5 } } },
              { score: 3, standards: { connect: { id: 6 } } },
              { score: 2, standards: { connect: { id: 7 } } },
            ],
          },
        },
      });
    });

    it("returns clinician's own responses", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);

          expect(json.responses.length).toEqual(2);
          expect(json.responses[0].scores.length).toEqual(7);
          expect(json.responses[0].words.length).toEqual(2);
          expect(Object.keys(json.averages).length).toEqual(7);
        },
      });
    });

    it("obeys 'from' filter", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        requestPatcher: req =>
          (req.url = '/api/responses?from=' + new Date().getTime()),
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.responses.length).toEqual(0);
        },
      });
    });

    it("obeys 'to' filter", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        requestPatcher: req =>
          (req.url =
            '/api/responses?to=' + (new Date().getTime() - 60 * 60 * 1000)), // 1 hour ago
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.responses.length).toEqual(0);
        },
      });
    });

    it("obeys 'only_is_mentoring_session' filter", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        requestPatcher: req =>
          (req.url = '/api/responses?only_is_mentoring_session=1'),
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.responses.length).toEqual(1);
        },
      });
    });

    it("obeys 'only_not_mentoring_session' filter", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
      await testApiHandler({
        handler,
        requestPatcher: req =>
          (req.url = '/api/responses?only_not_mentoring_session=1'),
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.responses.length).toEqual(1);
        },
      });
    });

    it("doesn't return user IDs", async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/responses'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);

          expect(Object.keys(json.responses[0])).not.toContain('user_id');
        },
      });
    });

    [Roles.USER_TYPE_ADMIN, Roles.USER_TYPE_UNKNOWN].forEach(userType => {
      it(`doesn't return responses to ${userType} users`, async () => {
        expect.hasAssertions();
        helpers.mockSessionWithUserType(userType);
        await testApiHandler({
          handler,
          test: async ({ fetch }) => {
            const res = await fetch();
            expect(res.status).toBe(200);

            const json = await res.json();
            const validator = await helpers.getOpenApiValidatorForRequest(
              '/responses'
            );
            expect(validator.validateResponse(200, json)).toEqual(undefined);
            expect(json.responses.length).toEqual(0);
          },
        });
      });
    });

    [
      Roles.USER_TYPE_DEPARTMENT,
      Roles.USER_TYPE_HOSPITAL,
      Roles.USER_TYPE_HEALTH_BOARD,
    ].forEach(userType => {
      it(`returns responses according to hierarchy to ${userType}s`, async () => {
        expect.hasAssertions();
        helpers.mockSessionWithUserType(userType);
        await testApiHandler({
          handler,
          test: async ({ fetch }) => {
            const res = await fetch();
            expect(res.status).toBe(200);

            const json = await res.json();
            const validator = await helpers.getOpenApiValidatorForRequest(
              '/responses'
            );
            expect(validator.validateResponse(200, json)).toEqual(undefined);
            expect(json.responses.length).toEqual(2);
          },
        });
      });
    });

    [
      Roles.USER_TYPE_DEPARTMENT,
      Roles.USER_TYPE_HOSPITAL,
      Roles.USER_TYPE_HEALTH_BOARD,
    ].forEach(userType => {
      it(`doesn't return responses to ${userType} users who are in a different location`, async () => {
        expect.hasAssertions();
        helpers.mockSessionWithUserType(userType, 2);
        await testApiHandler({
          handler,
          requestPatcher: req => (req.url = '/api/responses?user_id=clinician'),
          test: async ({ fetch }) => {
            const res = await fetch();
            expect(res.status).toBe(200);

            const json = await res.json();
            const validator = await helpers.getOpenApiValidatorForRequest(
              '/responses'
            );
            expect(validator.validateResponse(200, json)).toEqual(undefined);
            expect(json.responses.length).toEqual(0);
          },
        });
      });
    });
  });
});

describe('POST /api/responses', () => {
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

  it('allows user to add response', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            scores: [
              { standardId: 1, score: 1 },
              { standardId: 2, score: 2 },
              { standardId: 3, score: 3 },
              { standardId: 4, score: 4 },
              { standardId: 5, score: 0 },
              { standardId: 6, score: 2 },
              { standardId: 7, score: 3 },
            ],
            words: [{ questionId: 8, word: 'Test' }],
            is_mentoring_session: true,
          }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/responses',
          'post'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.user_id).toEqual('clinician');
        expect(json.is_mentoring_session).toEqual(true);
        expect(json.department_id).toEqual(1);
      },
    });
  });
});
