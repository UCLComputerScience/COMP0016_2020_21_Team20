/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import setUserDepartmentAndRole from '../../../lib/setUserDepartmentAndRole.js';
import handler, { config } from '../../../pages/api/departments/leave.js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

jest.mock('../../../lib/setUserDepartmentAndRole.js');
setUserDepartmentAndRole.mockReturnValue(true);

afterAll(() => prisma.$disconnect());

describe('POST /api/departments/leave', () => {
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
    Roles.USER_TYPE_HOSPITAL,
    Roles.USER_TYPE_HEALTH_BOARD,
    Roles.USER_TYPE_ADMIN,
    Roles.USER_TYPE_UNKNOWN,
  ].forEach(userType => {
    it(`doesn't allow ${userType} users to leave a department`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments/leave',
            'post'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });

  [Roles.USER_TYPE_CLINICIAN, Roles.USER_TYPE_DEPARTMENT].forEach(userType => {
    it(`allows ${userType} users to leave their department`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'POST' });
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/departments/leave',
            'post'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.success).toEqual(true);
        },
      });
    });
  });
});

describe('Invalid HTTP methods for /api/departments/leave', () => {
  ['GET', 'PUT', 'DELETE'].forEach(methodType => {
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
