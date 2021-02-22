const NodeEnvironment = require('jest-environment-node');
const prisma = require('../../lib/prisma');
const { nanoid } = require('nanoid');
require('dotenv').config();

class ApiTestEnvironment extends NodeEnvironment {
  constructor(config, context) {
    super(config, context);
  }

  async setup() {
    console.log('setting up');
    await super.setup();
    this.schema = `test_${nanoid()}`;
    await prisma.$disconnect();
    await prisma.$connect({
      datasources: {
        db: {
          url: `postgresql://cqdashboard:${process.env.POSTGRES_PASSWORD}@localhost:5432/test?schema=${this.schema}`,
        },
      },
    });
    await prisma.$executeRaw(`CREATE SCHEMA ${this.schema};`);
  }

  async teardown() {
    console.log('tearing down');
    await prisma.$executeRaw(`DROP SCHEMA IF EXISTS ${this.schema} CASCADE;`);
    await prisma.$disconnect();
    await super.teardown();
  }
}

module.exports = ApiTestEnvironment;
