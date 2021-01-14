const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const standards = [
  'Staff and Resources',
  'Staying Healthy',
  'Individual Care',
  'Timely Care',
  'Dignified Care',
  'Effective Care',
  'Safe Care',
  'Governance, Leadership and Accountability',
];

const likertScaleQuestions = [
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    standardId: 1,
    url: 'https://example.com',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    standardId: 2,
    url: 'https://example.com',
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standardId: 3,
    url: 'https://example.com',
  },
  {
    question:
      'I have listened and responded with empathy to the patient’s concerns.',
    standardId: 4,
    url: 'https://example.com',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    standardId: 5,
    url: 'https://example.com',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    standardId: 6,
    url: 'https://example.com',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    standardId: 7,
    url: 'https://example.com',
  },
];

const wordsQuestions = [
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    standardId: 8,
    url: 'https://example.com',
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    standardId: 8,
    url: 'https://example.com',
  },
];

const seedStandards = async () => {
  await Promise.all(
    standards.map(standard =>
      prisma.standards.create({ data: { name: standard } })
    )
  );
};

const seedEntities = async () => {
  await prisma.health_boards.create({
    data: {
      name: 'Demo Health Board',
      hospitals: {
        create: {
          name: 'Demo Hospital',
          departments: {
            create: {
              name: 'Demo Department',
              department_join_codes: { create: { code: 'aaa-aaa-aaa' } },
              clinician_join_codes: { create: { code: 'bbb-bbb-bbb' } },
            },
          },
        },
      },
    },
  });

  await prisma.users.create({
    data: {
      id: 'fa0c7dea-ade1-4425-c659-4bf56eae7eb6',
      user_type: 'clinician',
    },
  });
};

const seedQuestions = async () => {
  await Promise.all(
    likertScaleQuestions.map(question =>
      prisma.questions.create({
        data: {
          default_url: question.url,
          standards: { connect: { id: question.standardId } },
          type: 'likert_scale',
          body: question.question,
        },
      })
    )
  );

  await prisma.question_urls.create({
    data: {
      questions: { connect: { id: 1 } },
      departments: { connect: { id: 1 } },
      url: 'https://overriddenurl.com',
    },
  });

  await Promise.all(
    wordsQuestions.map(question =>
      prisma.questions.create({
        data: {
          default_url: question.url,
          standards: { connect: { id: question.standardId } },
          type: 'words',
          body: question.question,
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
