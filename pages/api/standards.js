import prisma from '../../lib/prisma';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'GET') {
    const standards = await prisma.standards.findMany();
    return res.json(standards);
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
