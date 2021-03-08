const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

const standards = [
  'Staying Healthy',
  'Safe Care',
  'Effective Care',
  'Dignified Care',
  'Timely Care',
  'Individual Care',
  'Staff and Resources',
  'Governance, Leadership and Accountability',
];

const likertScaleQuestions = [
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standardId: 1,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-1-staying-healthy',
  },
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    standardId: 2,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-2-safe-care',
  },
  {
    question:
      "I have applied knowledge of best evidence to the context of this patient's presentation to present appropriate treatment options to the patient.",
    standardId: 3,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-3-effective-care',
  },
  {
    question:
      "I have listened and responded with empathy to the patient's concerns.",
    standardId: 4,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-4-dignified-care',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    standardId: 5,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-5-timely-care',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    standardId: 6,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-6-individual-care',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    standardId: 7,
    url:
      'http://www.wales.nhs.uk/governance-emanual/theme-7-staff-and-resources',
  },
];

const wordsQuestions = [
  {
    id: 8,
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    standardId: 8,
    url:
      'http://www.wales.nhs.uk/governance-emanual/governance-leadership-and-accountability-1',
  },
  {
    id: 9,
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    standardId: 8,
    url:
      'http://www.wales.nhs.uk/governance-emanual/governance-leadership-and-accountability-1',
  },
];

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
  await Promise.all(
    wordsQuestions.map(question =>
      prisma.questions.create({
        data: {
          id: question.id,
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
