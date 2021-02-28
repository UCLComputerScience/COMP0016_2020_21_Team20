/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../../pages/api/departments/index.js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(() => prisma.$disconnect());

describe('GET /api/departments', () => {
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
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_CLINICIAN,
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't return departments to ${userType}`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('only returns departments in own hospital to hospital users', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HOSPITAL, 2);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        // Ensure the returned department is the (single) department in hospital ID 2
        expect(json).toHaveLength(1);
        expect(json[0].id).toEqual(3);
      },
    });
  });

  it('only returns departments in own health board to health board users', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HEALTH_BOARD, 2);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        // Ensure the returned departments are in health board ID 2 (i.e. ID >3)
        expect(json).toHaveLength(3);
        json.forEach(d => expect(d.id).toBeGreaterThan(3));
      },
    });
  });
});

describe('POST /api/departments', () => {
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
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to add a new department`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
          });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments',
            'post'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it('allows hospitals to add a new department', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HOSPITAL);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: 'Test Department Creation' }),
        });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments',
          'post'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const isDepartmentInDb = await prisma.departments.count({
          where: { name: { equals: 'Test Department Creation' } },
        });
        expect(isDepartmentInDb).toEqual(1);
      },
    });
  });

  it('validates request bodies', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HOSPITAL);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch({
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ test: 'test' }),
        });
        expect(res.status).toBe(422);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments',
          'post'
        );
        expect(validator.validateResponse(422, json)).toEqual(undefined);
      },
    });
  });
});
