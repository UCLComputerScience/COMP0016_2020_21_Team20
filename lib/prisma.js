import { PrismaClient } from '@prisma/client';

// Single instance throughout app
const prisma = new PrismaClient();
export default prisma;
