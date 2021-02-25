/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import fs from 'fs';

import { testApiHandler } from 'next-test-api-route-handler';
import handler, { config } from '../../pages/api/recent_words';
import jestOpenAPI from 'jest-openapi';
import helpers from './helpers';
import prisma from '../../lib/prisma';

handler.config = config;

jestOpenAPI(
  JSON.parse(fs.readFileSync('care-quality-dashboard-api.json', 'utf-8'))
);

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
          { word: 'rewarding', questions: { connect: { id: 8 } } },
          { word: 'complex', questions: { connect: { id: 9 } } },
        ],
      },
    },
  });
});

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
        const json = await res.json();
        expect(json.words.sort()).toEqual([
          'complex',
          'rewarding',
          'satisfying',
        ]);
      },
    });
  });
});
