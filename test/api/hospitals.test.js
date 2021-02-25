/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../pages/api/hospitals';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

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

  ['clinician', 'hospital', 'platform_administrator'].forEach(userType => {
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

  it('returns hospitals', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType('health_board');
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = helpers.getOpenApiValidatorForRequest('/hospitals');
        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.length).toEqual(1);
        expect(json[0]).toEqual({ name: 'Test Hospital', id: 1 });
      },
    });
  });
});
