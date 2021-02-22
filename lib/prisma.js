const { PrismaClient } = require('@prisma/client');

// Single instance throughout app
const prisma = new PrismaClient();
module.exports = prisma;
