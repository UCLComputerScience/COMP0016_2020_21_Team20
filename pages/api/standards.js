import prisma from '../../lib/prisma';

import requiresAuth from '../../lib/requiresAuthApiMiddleware';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const standards = await prisma.standards.findMany();
    return res.json(standards);
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
};

export default requiresAuth(handler);
