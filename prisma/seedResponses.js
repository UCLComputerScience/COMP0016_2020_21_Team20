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
        is_mentoring_session: false,
        scores: {
          create: [
            { score: 3, standards: { connect: { id: 1 } } },
            { score: 1, standards: { connect: { id: 2 } } },
            { score: 2, standards: { connect: { id: 3 } } },
            { score: 4, standards: { connect: { id: 4 } } },
            { score: 2, standards: { connect: { id: 5 } } },
            { score: 4, standards: { connect: { id: 6 } } },
            { score: 0, standards: { connect: { id: 7 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-07 13:00:00'),
        is_mentoring_session: true,
        scores: {
          create: [
            { score: 4, standards: { connect: { id: 1 } } },
            { score: 2, standards: { connect: { id: 2 } } },
            { score: 2, standards: { connect: { id: 3 } } },
            { score: 3, standards: { connect: { id: 4 } } },
            { score: 3, standards: { connect: { id: 5 } } },
            { score: 4, standards: { connect: { id: 6 } } },
            { score: 2, standards: { connect: { id: 7 } } },
          ],
        },
      },
    }),
    prisma.responses.create({
      data: {
        users: { connect: { id: userId } },
        departments: { connect: { id: 1 } },
        timestamp: new Date('2020-12-14 13:00:00'),
        is_mentoring_session: false,
        scores: {
          create: [
            { score: 4, standards: { connect: { id: 1 } } },
            { score: 2, standards: { connect: { id: 2 } } },
            { score: 3, standards: { connect: { id: 3 } } },
            { score: 4, standards: { connect: { id: 4 } } },
            { score: 3, standards: { connect: { id: 5 } } },
            { score: 3, standards: { connect: { id: 6 } } },
            { score: 2, standards: { connect: { id: 7 } } },
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
            { score: 4, standards: { connect: { id: 1 } } },
            { score: 3, standards: { connect: { id: 2 } } },
            { score: 2, standards: { connect: { id: 3 } } },
            { score: 4, standards: { connect: { id: 4 } } },
            { score: 2, standards: { connect: { id: 5 } } },
            { score: 3, standards: { connect: { id: 6 } } },
            { score: 2, standards: { connect: { id: 7 } } },
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
