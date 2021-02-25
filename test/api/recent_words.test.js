/**
 * @jest-environment ./test/api/api-test.environment.js
 */
import { testApiHandler } from 'next-test-api-route-handler';
import client from 'next-auth/client';

import handler, { config } from '../../pages/api/recent_words';
import prisma from '../../lib/prisma';
import helpers from './helpers';

jest.mock('next-auth/client');
handler.config = config;

beforeAll(async () => {
  const mockSession = {
    expires: '1',
    user: { email: 'clinician@example.com', name: 'Clinician', image: null },
  };

  client.useSession.mockReturnValueOnce([mockSession, false]);
  client.getSession.mockReturnValueOnce([mockSession, false]);

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
