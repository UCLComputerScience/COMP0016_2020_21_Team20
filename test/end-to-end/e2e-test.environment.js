const fs = require('fs');

const PuppeteerEnvironment = require('jest-environment-puppeteer');
const { Client: PgClient } = require('pg');
const fetch = require('node-fetch');

const prisma = require('../../lib/prisma');

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

const users = [
  {
    email: 'clinician@example.com',
    credentials: [{ type: 'password', value: 'clinician', temporary: false }],
    enabled: true,
    realmRoles: ['clinician'],
    attributes: { department_id: 1 },
  },
  {
    email: 'department@example.com',
    credentials: [{ type: 'password', value: 'department', temporary: false }],
    enabled: true,
    realmRoles: ['department_manager'],
    attributes: { department_id: 1 },
  },
  {
    email: 'hospital@example.com',
    credentials: [{ type: 'password', value: 'hospital', temporary: false }],
    enabled: true,
    realmRoles: ['hospital'],
    attributes: { hospital_id: 1 },
  },
  {
    email: 'healthboard@example.com',
    credentials: [{ type: 'password', value: 'healthboard', temporary: false }],
    enabled: true,
    realmRoles: ['health_board'],
    attributes: { health_board_id: 1 },
  },
  {
    email: 'admin@example.com',
    credentials: [{ type: 'password', value: 'admin', temporary: false }],
    enabled: true,
    realmRoles: ['platform_administrator'],
  },
];

const getKeycloakAdminAccessToken = async () => {
  const res = await fetch(
    'http://localhost:8080/auth/realms/master/protocol/openid-connect/token',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: `client_id=admin-cli&username=${process.env.KEYCLOAK_USER}&password=${process.env.KEYCLOAK_PASSWORD}&grant_type=password`,
    }
  ).then(res => res.json());

  return res.access_token;
};

const deleteTestRealm = async () => {
  const adminAccessToken = await getKeycloakAdminAccessToken();
  const res = await fetch('http://localhost:8080/auth/admin/realms/test', {
    method: 'DELETE',
    headers: { Authorization: 'Bearer ' + adminAccessToken },
  });

  // Might be 404 if realm doesn't exist, or 204 (no content) if successful
  if (res.status !== 204 && res.status !== 404) {
    throw new Error('Failed to delete Keycloak test realm');
  }
};

const createUser = async (user, adminAccessToken) => {
  // This would be simpler if Keycloak supported the `realmRoles` property
  // in the POST /users endpoint (as they say they do in their docs.).
  // But, they don't. So we need to do it in 2 requests: create user, then set role

  const res = await fetch(
    'http://localhost:8080/auth/admin/realms/test/users',
    {
      method: 'POST',
      body: JSON.stringify(user),
      headers: {
        Authorization: 'Bearer ' + adminAccessToken,
        'Content-Type': 'application/json',
      },
    }
  );

  if (res.status !== 201) {
    console.error('Failed to create user');
    return res.status;
  }

  const userId = res.headers.get('Location').split('/').pop();
  const availableRoles = await fetch(
    `http://localhost:8080/auth/admin/realms/test/users/${userId}/role-mappings/realm/available`,
    {
      headers: { Authorization: 'Bearer ' + adminAccessToken },
    }
  ).then(res => res.json());

  const roleToAdd = availableRoles.find(r => r.name === user.realmRoles[0]);
  const status = await fetch(
    `http://localhost:8080/auth/admin/realms/test/users/${userId}/role-mappings/realm`,
    {
      headers: {
        Authorization: 'Bearer ' + adminAccessToken,
        'Content-Type': 'application/json',
      },
      method: 'POST',
      body: JSON.stringify([roleToAdd]),
    }
  ).then(res => res.status);

  return status;
};

const createKeycloakDefaultUsers = async () => {
  const adminAccessToken = await getKeycloakAdminAccessToken();
  const results = await Promise.all(
    users.map(user => createUser(user, adminAccessToken))
  );

  if (results.find(r => r !== 204)) {
    throw new Error('Failed to add Keycloak test users');
  }
};

const createTestRealm = async () => {
  const realmToImport = fs.readFileSync('./keycloak/test_realm.json', 'utf-8');

  const adminAccessToken = await getKeycloakAdminAccessToken();
  const res = await fetch('http://localhost:8080/auth/admin/realms', {
    method: 'POST',
    body: realmToImport,
    headers: {
      Authorization: 'Bearer ' + adminAccessToken,
      'Content-Type': 'application/json',
    },
  });

  if (res.status !== 201) {
    throw new Error('Failed to create test realm');
  }

  await createKeycloakDefaultUsers();
};

class PuppeteerTestEnvironment extends PuppeteerEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    await deleteTestRealm();
    await createTestRealm();

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

    // Start auto-incrementing at 1000 (large number) so the hard-coded values
    // in the tests don't cause conflicts
    await client.query('ALTER SEQUENCE departments_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE hospitals_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE health_boards_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE questions_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE responses_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE standards_id_seq RESTART 1000;');
    await client.query('ALTER SEQUENCE words_id_seq RESTART 1000;');

    await client.end();

    await prisma.$disconnect();
    await prisma.$connect({
      datasources: { db: { url: process.env.DATABASE_URL } },
    });

    await Promise.all([
      prisma.health_boards.create({
        data: {
          id: 1,
          name: 'Test Health Board',
          hospitals: {
            create: [
              {
                id: 1,
                name: 'Test Hospital',
                departments: {
                  create: [
                    { id: 1, name: 'Test Department' },
                    { id: 2, name: 'Test Department 2' },
                  ],
                },
              },
              {
                id: 2,
                name: 'Test Hospital 2',
                departments: {
                  create: [{ id: 3, name: 'Test Department 3' }],
                },
              },
            ],
          },
        },
      }),
      prisma.health_boards.create({
        data: {
          id: 2,
          name: 'Test Health Board 2',
          hospitals: {
            create: [
              {
                id: 3,
                name: 'Test Hospital 3',
                departments: {
                  create: [
                    { id: 4, name: 'Test Department 4' },
                    { id: 5, name: 'Test Department 5' },
                  ],
                },
              },
              {
                id: 4,
                name: 'Test Hospital 4',
                departments: {
                  create: [{ id: 6, name: 'Test Department 6' }],
                },
              },
            ],
          },
        },
      }),
      ...standards.map((standard, i) =>
        prisma.standards.create({ data: { name: standard, id: i + 1 } })
      ),
    ]);

    await Promise.all([
      ...likertScaleQuestions.map((question, i) =>
        prisma.questions.create({
          data: {
            id: i + 1,
            default_url: question.url,
            standard_id: question.standardId,
            type: 'likert_scale',
            body: question.question,
          },
        })
      ),
    ]);

    await Promise.all([
      ...wordsQuestions.map((question, i) =>
        prisma.questions.create({
          data: {
            id: i + likertScaleQuestions.length + 1,
            default_url: question.url,
            standard_id: question.standardId,
            type: 'words',
            body: question.question,
          },
        })
      ),
    ]);
  }

  async teardown() {
    await deleteTestRealm();
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

module.exports = PuppeteerTestEnvironment;
