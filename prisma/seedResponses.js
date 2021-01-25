const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const getRandomScore = () => Math.floor(Math.random() * 5);

const seedResponses = async userId => {
  await Promise.all([
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-01 13:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'satisfying', questions: { connect: { id: 8 } } },
            { word: 'rewarding', questions: { connect: { id: 8 } } },
            { word: 'educational', questions: { connect: { id: 8 } } },
            { word: 'stressful', questions: { connect: { id: 9 } } },
            { word: 'tiring', questions: { connect: { id: 9 } } },
            { word: 'complex', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-07 13:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'rewarding', questions: { connect: { id: 8 } } },
            { word: 'honourable', questions: { connect: { id: 8 } } },
            { word: 'enjoyable', questions: { connect: { id: 8 } } },
            { word: 'stressful', questions: { connect: { id: 9 } } },
            { word: 'draining', questions: { connect: { id: 9 } } },
            { word: 'exhausting', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-14 13:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'worthy', questions: { connect: { id: 8 } } },
            { word: 'quiet', questions: { connect: { id: 8 } } },
            { word: 'efficient', questions: { connect: { id: 8 } } },
            { word: 'painful', questions: { connect: { id: 9 } } },
            { word: 'tiring', questions: { connect: { id: 9 } } },
            { word: 'long', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-21 13:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'moving', questions: { connect: { id: 8 } } },
            { word: 'pleasing', questions: { connect: { id: 8 } } },
            { word: 'educational', questions: { connect: { id: 8 } } },
            { word: 'stressful', questions: { connect: { id: 9 } } },
            { word: 'exhausting', questions: { connect: { id: 9 } } },
            { word: 'draining', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-26 16:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2021-01-01 10:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'educational', questions: { connect: { id: 8 } } },
            { word: 'stressful', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2021-01-11 17:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { score: getRandomScore(), standards: { connect: { id: 1 } } },
            { score: getRandomScore(), standards: { connect: { id: 2 } } },
            { score: getRandomScore(), standards: { connect: { id: 3 } } },
            { score: getRandomScore(), standards: { connect: { id: 4 } } },
            { score: getRandomScore(), standards: { connect: { id: 5 } } },
            { score: getRandomScore(), standards: { connect: { id: 6 } } },
            { score: getRandomScore(), standards: { connect: { id: 7 } } },
          ],
        },
        words: {
          create: [
            { word: 'pleasing', questions: { connect: { id: 8 } } },
            { word: 'stressful', questions: { connect: { id: 9 } } },
            { word: 'exhausting', questions: { connect: { id: 9 } } },
          ],
        },
      },
    }),
  ]);
};

const userId = process.argv[2];
if (!userId) {
  return console.error(
    'You must run this script with the user ID for whom you want to insert data. e.g. node seedResponses.js fa0c7dea-ade1-4425-c659-4bf56eae7eb6'
  );
}

console.log('Seeding responses for user ' + userId);
seedResponses(userId)
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
