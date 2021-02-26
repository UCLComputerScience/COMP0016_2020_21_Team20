/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';

import handler, { config } from '../../pages/api/recent_words';
import { Roles } from '../../lib/constants';
import prisma from '../../lib/prisma';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

afterAll(async () => {
  await prisma.$executeRaw('TRUNCATE TABLE responses CASCADE;');
  await prisma.$disconnect();
});

describe('GET /api/recent_words', () => {
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

  it('returns no words', async () => {
    expect.hasAssertions();
    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = helpers.getOpenApiValidatorForRequest(
          '/recent_words'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);
        expect(json.words.length).toEqual(0);
      },
    });
  });

  it('returns words', async () => {
    expect.hasAssertions();
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

    helpers.mockSessionWithUserType(Roles.USER_TYPE_CLINICIAN);
    await testApiHandler({
      handler,
      test: async ({ fetch }) => {
        const res = await fetch();
        expect(res.status).toBe(200);

        const json = await res.json();
        const validator = helpers.getOpenApiValidatorForRequest(
          '/recent_words'
        );
        expect(validator.validateResponse(200, json)).toEqual(undefined);

        expect(json.words.sort()).toEqual([
          'complex',
          'rewarding',
          'satisfying',
        ]);
      },
    });
  });
});
