/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import fs from 'fs';

import { testApiHandler } from 'next-test-api-route-handler';
import handler, { config } from '../../pages/api/recent_words';
import jestOpenAPI from 'jest-openapi';
import helpers from './helpers';

handler.config = config;

jestOpenAPI(
  JSON.parse(fs.readFileSync('care-quality-dashboard-api.json', 'utf-8'))
);

describe('GET /api/recent_words', () => {
  it('returns words', async () => {
    expect.hasAssertions();
    await testApiHandler({
      handler,
      requestPatcher: req => (req.headers = { key: process.env.SPECIAL_TOKEN }),
      test: async ({ fetch }) => {
        const res = await fetch();
        console.log(await res.json());
        expect(res.status).toBe(200);
        expect(res).toSatisfyApiSpec();
      },
    });
  });
});
