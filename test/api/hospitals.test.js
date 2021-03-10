/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../pages/api/hospitals';
import { Roles } from '../../lib/constants';
import prisma from '../../lib/prisma';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(() => prisma.$disconnect());

describe('GET /api/hospitals', () => {
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

  [Roles.USER_TYPE_ADMIN, Roles.USER_TYPE_HEALTH_BOARD].forEach(userType => {
    it(`returns hospitals to ${userType} users`, async () => {
      expect.hasAssertions();
      helpers.mockSessionWithUserType(userType);
      await testApiHandler({
        handler,
        test: async ({ fetch }) => {
          const res = await fetch();
          expect(res.status).toBe(200);

          const json = await res.json();
          const validator = await helpers.getOpenApiValidatorForRequest(
            '/hospitals'
          );

          expect(validator.validateResponse(200, json)).toEqual(undefined);
          expect(json.length).toEqual(
            userType === Roles.USER_TYPE_ADMIN ? 4 : 2
          );

          expect(json[0]).toMatchObject({
            name: 'Test Hospital',
            id: 1,
            health_board: { id: 1, name: 'Test Health Board' },
          });

          expect(json[1]).toMatchObject({
            name: 'Test Hospital 2',
            id: 2,
            health_board: { id: 1, name: 'Test Health Board' },
          });

          if (userType === Roles.USER_TYPE_ADMIN) {
            expect(json[2]).toMatchObject({
              name: 'Test Hospital 3',
              id: 3,
              health_board: { id: 2, name: 'Test Health Board 2' },
            });

            expect(json[3]).toMatchObject({
              name: 'Test Hospital 4',
              id: 4,
              health_board: { id: 2, name: 'Test Health Board 2' },
            });
          }
        },
      });
    });
  });
});
