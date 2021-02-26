const fs = require('fs');

const NodeEnvironment = require('jest-environment-node');
const prisma = require('../../lib/prisma');
const { Client: PgClient } = require('pg');

const getClient = async () => {
  const client = new PgClient({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  return client;
};

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
    url:
      'http://www.wales.nhs.uk/governance-emanual/theme-7-staff-and-resources',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    standardId: 2,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-1-staying-healthy',
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standardId: 3,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-6-individual-care',
  },
  {
    question:
      'I have listened and responded with empathy to the patient’s concerns.',
    standardId: 4,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-5-timely-care',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    standardId: 5,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-4-dignified-care',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    standardId: 6,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-3-effective-care',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    standardId: 7,
    url: 'http://www.wales.nhs.uk/governance-emanual/theme-2-safe-care',
  },
];

const wordsQuestions = [
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    standardId: 8,
    url:
      'http://www.wales.nhs.uk/governance-emanual/governance-leadership-and-accountability-1',
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    standardId: 8,
    url:
      'http://www.wales.nhs.uk/governance-emanual/governance-leadership-and-accountability-1',
  },
];

class ApiTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    const client = await getClient();
    await client.query('DROP SCHEMA IF EXISTS public CASCADE;');
    await client.query('CREATE SCHEMA public;');
    const schema = fs.readFileSync('schema.sql', 'utf8');
    const schemaLines = schema.split(';');
    for (let i = 0; i < schemaLines.length; i++) {
      const line = schemaLines[i].trim() + ';';
      if (line.startsWith('--')) continue;
      await client.query(line);
    }
    await client.end();

    await prisma.$disconnect();
    await prisma.$connect({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });

    await Promise.all([
      prisma.users.create({
        data: {
          id: 'clinician',
          user_type: 'clinician',
        },
      }),
      prisma.users.create({
        data: {
          id: 'department_manager',
          user_type: 'department_manager',
        },
      }),
      prisma.users.create({
        data: {
          id: 'hospital',
          user_type: 'hospital',
        },
      }),
      prisma.users.create({
        data: {
          id: 'health_board',
          user_type: 'health_board',
        },
      }),
      prisma.health_boards.create({
        data: {
          id: 1,
          name: 'Test Health Board',
          hospitals: {
            create: {
              id: 1,
              name: 'Test Hospital',
              departments: { create: { id: 1, name: 'Test Department' } },
            },
          },
        },
      }),
      ...standards.map((standard, i) =>
        prisma.standards.create({ data: { name: standard } })
      ),
    ]);

    await Promise.all([
      ...likertScaleQuestions.map(question =>
        prisma.questions.create({
          data: {
            default_url: question.url,
            standards: { connect: { id: question.standardId } },
            type: 'likert_scale',
            body: question.question,
          },
        })
      ),
      ...wordsQuestions.map(question =>
        prisma.questions.create({
          data: {
            default_url: question.url,
            standards: { connect: { id: question.standardId } },
            type: 'words',
            body: question.question,
          },
        })
      ),
    ]);
  }

  async teardown() {
    await prisma.$disconnect();
    const client = await getClient();
    await client.query(`DROP SCHEMA public CASCADE;`);
    await client.end();
    await super.teardown();
  }

  runScript(script) {
    return super.runScript(script);
  }
}

module.exports = ApiTestEnvironment;
