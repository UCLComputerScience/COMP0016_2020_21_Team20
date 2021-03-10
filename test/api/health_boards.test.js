/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../pages/api/health_boards';
import { Roles } from '../../lib/constants';
import prisma from '../../lib/prisma';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(() => prisma.$disconnect());

describe('GET /api/health_boards', () => {
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

  [
    Roles.USER_TYPE_CLINICIAN,
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`rejects ${userType}s`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(403);
        },
      });
    });
  });

  it('returns health boards to admins', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/health_boards'
        );

        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.length).toEqual(2);

        expect(json[0]).toMatchObject({
          name: 'Test Health Board',
          id: 1,
        });

        expect(json[1]).toMatchObject({
          name: 'Test Health Board 2',
          id: 2,
        });
      },
    });
  });
});

describe('POST /api/health_boards', () => {
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

  [
    Roles.USER_TYPE_CLINICIAN,
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} user types to add health boards`, async () => {
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
            '/health_boards',
            'post'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows admins to add a new health board', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_ADMIN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: 'Test Health Board 100',
          }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/health_boards',
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
          body: JSON.stringify({ foo: 'bar' }),
        });
        expect(res.status).toBe(422);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/health_boards',
          'post'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });
});
