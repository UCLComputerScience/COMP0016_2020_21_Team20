import prisma from '../../lib/prisma';

import requiresAuth from '../../lib/requiresAuthApiMiddleware';

const handler = async (req, res) => {
  if (req.method === 'GET') {
    const standards = await prisma.standards.findMany();
    return res.json(standards);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
