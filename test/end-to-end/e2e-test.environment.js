const fs = require('fs');
const spawnd = require('spawnd');

const NodeEnvironment = require('jest-environment-node');
const { Client: PgClient } = require('pg');
const puppeteer = require('puppeteer');
const fetch = require('node-fetch');

const prisma = require('../../lib/prisma');
const {
  standards,
  likertScaleQuestions,
  wordsQuestions,
} = require('../../seedData');

const getClient = async () => {
  const client = new PgClient({ connectionString: process.env.DATABASE_URL });
  await client.connect();
  return client;
};

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

class PuppeteerTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    await super.setup();

    await deleteTestRealm();
    await createTestRealm();

    // Start a Next (web-app) server for each test suite (file)
    this.global.server = spawnd('npm', ['run', 'start']);
    this.global.server.stdout.on('data', data => console.log(data.toString()));
    this.global.server.stderr.on('data', data =>
      console.error(data.toString())
    );

    // Give each test suite (file) it's own new global browser and page
    this.global.browser = await puppeteer.launch({
      defaultViewport: { width: 1920, height: 1500 },
      timeout: 10000,
    });
    this.global.page = await this.global.browser.newPage();

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
                    {
                      id: 1,
                      name: 'Test Department',
                      clinician_join_codes: { create: { code: 'aaa-aaa-aaa' } },
                      department_join_codes: {
                        create: { code: 'bbb-bbb-bbb' },
                      },
                    },
                    {
                      id: 2,
                      name: 'Test Department 2',
                      department_join_codes: {
                        create: { code: 'ccc-ccc-ccc' },
                      },
                    },
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
            id: question.id,
            default_url: question.url,
            standard_id: question.standardId,
            type: 'words',
            body: question.question,
          },
        })
      ),
    ]);

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
  }

  async teardown() {
    await deleteTestRealm();
    await prisma.$disconnect();
    this.global.server.destroy();
    await this.global.page.close();
    await this.global.browser.close();
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
