const { PrismaClient } = require('@prisma/client');
const {
  standards,
  likertScaleQuestions,
  wordsQuestions,
} = require('../seedData');

const prisma = new PrismaClient();

const seedStandards = async () => {
  await Promise.all(
    standards.map((standard, i) =>
      prisma.standards.create({ data: { name: standard, id: i + 1 } })
    )
  );
};

const seedEntities = async () => {
  await prisma.health_boards.create({
    data: {
      name: 'Aneurin Bevan',
      hospitals: {
        create: [
          {
            name: 'The Grange University Hospital',
            departments: {
              create: [
                {
                  name: 'Band 5 Physiotherapist',
                  department_join_codes: { create: { code: 'DRC-HtZ-xrt' } },
                  clinician_join_codes: { create: { code: 'de6-Ndv-V0z' } },
                },
                {
                  name: 'Rotational Band 6 Physiotherapist',
                  department_join_codes: { create: { code: '0ON-c5n-0tj' } },
                  clinician_join_codes: { create: { code: 'xVr-kKT-1Gc' } },
                },
                {
                  name: 'Band 6 MSK pod/static Physiotherapist',
                  department_join_codes: { create: { code: 'RMw-sWA-pnd' } },
                  clinician_join_codes: { create: { code: 'JPH-BRM-fQV' } },
                },
                {
                  name: 'Band 7 Physiotherapist',
                  department_join_codes: { create: { code: 'U3a-D9b-ai0' } },
                  clinician_join_codes: { create: { code: 'Dvl-9xl-Dvp' } },
                },
                {
                  name: 'Band 8 Physiotherapist',
                  department_join_codes: { create: { code: 'd75-ira-tX8' } },
                  clinician_join_codes: { create: { code: 'sEw-zjp-ouJ' } },
                },
              ],
            },
          },
          {
            name: 'Royal Gwent Hospital',
            departments: {
              create: [
                {
                  name: 'Band 5 Physiotherapist',
                  department_join_codes: { create: { code: 'ZQ5-gG7-ExH' } },
                  clinician_join_codes: { create: { code: 'U7N-vvs-obz' } },
                },
              ],
            },
          },
        ],
      },
    },
  });
};

const seedQuestions = async () => {
  await Promise.all(
    likertScaleQuestions.map(question => {
      const data = {
        default_url: question.url,
        standards: { connect: { id: question.standardId } },
        type: 'likert_scale',
        body: question.question,
      };

      return prisma.questions.create({ data });
    })
  );

  // 'Word' Questions have their IDs hardcoded to enable filtering for different
  // word clouds in the UI
  // Use upsert because Prisma doesn't support create() with a hardcoded ID when
  // the field is an autoincremented field
  await Promise.all(
    wordsQuestions.map(question =>
      prisma.questions.upsert({
        create: {
          default_url: question.url,
          standards: { connect: { id: question.standardId } },
          type: 'words',
          body: question.question,
        },
        update: {
          default_url: question.url,
          standards: { connect: { id: question.standardId } },
          type: 'words',
          body: question.question,
        },
        where: {
          id: question.id,
        },
      })
    )
  );
};

const seedData = async () => {
  await seedStandards();
  await seedEntities();
  await seedQuestions();
};

seedData()
  .catch(e => console.error(e))
  .finally(async () => await prisma.$disconnect());
