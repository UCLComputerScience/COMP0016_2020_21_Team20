/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, {
  config,
} from '../../../pages/api/departments/[departmentId].js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

beforeAll(async () => {
  await prisma.departments.create({
    data: {
      name: 'Test Department',
      id: 100,
      hospital_id: 1,
      archived: false,
    },
  });
});

afterAll(async () => {
  await prisma.$executeRaw('DELETE FROM departments WHERE id=100;');
  await prisma.$disconnect();
});

describe('GET /api/departments/{id}', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      params: { departmentId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({});
        expect(res.status).toBe(401);
      },
    });
  });

  it("doesn't allow clinicians users to view individual departments", async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      params: { departmentId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({});
        expect(res.status).toBe(403);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments/{id}'
        );
        expect(validator.validateResponse(403, json)).toEqual(undefined);
      },
    });
  });

  [
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_HEALTH_BOARD,
  ].forEach(userType => {
    it(`doesn't allow ${userType} to view departments in other ${userType} entities`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType, 2);
      await testApiHandler({
        handler,
        params: { departmentId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({});
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments/{id}'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  [
    Roles.USER_TYPE_DEPARTMENT,
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_HEALTH_BOARD,
  ].forEach(userType => {
    it(`returns the requested department correctly for ${userType}`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(
        userType,
        userType === Roles.USER_TYPE_DEPARTMENT ? 100 : 1
      );

      await testApiHandler({
        handler,
        params: { departmentId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({});
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments/{id}'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.id).toEqual(100);
          expect(json.name).toEqual('Test Department');
        },
      });
    });
  });
});

describe('DELETE /api/departments/{departmentId}', () => {
  it('is guarded by auth', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(null);
    await testApiHandler({
      handler,
      params: { departmentId: 100 },
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
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to archive/delete departments`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        params: { departmentId: 100 },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'DELETE' });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments/{id}',
            'delete'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  it("doesn't allow hospitals to archive/delete departments in another hospital", async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HOSPITAL, 2);
    await testApiHandler({
      handler,
      params: { departmentId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(403);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments/{id}',
          'delete'
        );
        expect(validator.validateResponse(403, json)).toEqual(undefined);
      },
    });
  });

  it('allows hospitals to archive/delete departments in their hospital', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_HOSPITAL, 1);
    await testApiHandler({
      handler,
      params: { departmentId: 100 },
      test: async ({ fetch }) => {
        const res = await fetch({ method: 'DELETE' });
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = await helpers.getOpenApiValidatorForRequest(
          '/departments/{id}',
          'delete'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        const isDepartmentArchived = await prisma.departments.count({
          where: {
            AND: { id: { equals: 100 }, archived: { equals: true } },
          },
        });
        expect(isDepartmentArchived).toEqual(1);
      },
    });
  });
});
