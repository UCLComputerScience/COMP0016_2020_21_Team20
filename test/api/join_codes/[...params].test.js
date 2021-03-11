/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../../pages/api/join_codes/[...params].js';
import { Roles } from '../../../lib/constants';
import prisma from '../../../lib/prisma';
import helpers from '../helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(() => prisma.$disconnect());

['department_manager', 'hospital'].forEach(testUserType => {
  describe(`PUT /api/join_codes/${testUserType}/{id}`, () => {
    it('is guarded by auth', async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(null);
      await testApiHandler({
        handler,
        params: { params: [testUserType, 1] },
        test: async ({ fetch }) => {
          const res = await fetch({ method: 'PUT' });
          expect(res.status).toBe(401);
        },
      });
    });

    [
      Roles.USER_TYPE_CLINICIAN,
      Roles.USER_TYPE_HEALTH_BOARD,
      testUserType === Roles.USER_TYPE_HOSPITAL
        ? Roles.USER_TYPE_DEPARTMENT
        : Roles.USER_TYPE_HOSPITAL,
      Roles.USER_TYPE_ADMIN,
      Roles.USER_TYPE_UNKNOWN,
    ].forEach(userType => {
      it(`doesn't allow ${userType} users to update ${
        testUserType === Roles.USER_TYPE_HOSPITAL
          ? 'hospital-department'
          : 'department-clinician'
      } join codes`, async () => {
        expect.hasAssertions();
        helpers.mockSessionWithUserType(userType);
        await testApiHandler({
          handler,
          params: { params: [testUserType, 1] },
          test: async ({ fetch }) => {
            const res = await fetch({ method: 'PUT' });
            expect(res.status).toBe(403);

            const json = await res.json();
            const validator = await helpers.getOpenApiValidatorForRequest(
              `/join_codes/${testUserType}/{id}`,
              'put'
            );
            expect(validator.validateResponse(403, json)).toEqual(undefined);
          },
        });
      });
    });

    it(`allows ${
      testUserType === Roles.USER_TYPE_HOSPITAL
        ? 'hospitals'
        : 'department manager'
    } to update ${
      testUserType === Roles.USER_TYPE_HOSPITAL
        ? 'hospital-department'
        : 'department-clinician'
    } join codes`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(testUserType, 1);
      await testApiHandler({
        handler,
        params: { params: [testUserType, 1] },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url: 'https://overriddenurl.com' }),
          });
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            `/join_codes/${testUserType}/{id}`,
            'put'
          );
          expect(validator.validateResponse(200, json)).toEqual(undefined);

          const table =
            testUserType === Roles.USER_TYPE_HOSPITAL
              ? prisma.department_join_codes
              : prisma.clinician_join_codes;

          const newJoinCode = await table.findFirst({
            select: { code: true },
            where: { department_id: 1 },
          });
          expect(newJoinCode.code).not.toBe(null);
          expect(newJoinCode.code).toEqual(
            expect.stringMatching(
              /^[A-Za-z0-9]{3}-[A-Za-z0-9]{3}-[A-Za-z0-9]{3}$/
            )
          );
        },
      });
    });

    it(`validates ${testUserType} can only update join codes for their ${
      testUserType === Roles.USER_TYPE_HOSPITAL ? 'hospital' : 'department'
    }`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(
        testUserType,
        testUserType === Roles.USER_TYPE_HOSPITAL ? 3 : 1
      );
      await testApiHandler({
        handler,
        params: { params: [testUserType, 2] },
        test: async ({ fetch }) => {
          const res = await fetch({
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
          });
          expect(res.status).toBe(403);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            `/join_codes/${testUserType}/{id}`,
            'put'
          );
          expect(validator.validateResponse(403, json)).toEqual(undefined);
        },
      });
    });
  });
});

describe('Invalid HTTP methods for /api/join_codes/*', () => {
  ['DELETE', 'GET', 'POST'].forEach(methodType => {
    it(`doesn't allow ${methodType} requests`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT);
      await testApiHandler({
        handler,
        params: { params: ['department_manager', 2] },
        test: async ({ fetch }) => {
          const res = await fetch({ method: methodType });
          expect(res.status).toBe(405);
        },
      });
    });
  });

  it(`doesn't allow non-existent path requests`, async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_DEPARTMENT);
    await testApiHandler({
      handler,
      params: { params: ['foo', 'bar'] },
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(404);
      },
    });
  });
});
