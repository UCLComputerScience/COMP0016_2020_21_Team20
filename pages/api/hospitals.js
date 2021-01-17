import prisma from '../../lib/prisma';
import Roles from '../../lib/constants';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'GET') {
    if (!session.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      res.statusCode = 403;
      return res.end('You do not have permission to view hospitals');
    }

    const hospitals = await prisma.hospitals.findMany({
      where: {
        health_board_id: { equals: session.user.healthBoardId },
      },
    });

    // Only return the name and id of the hospital
    return res.json(hospitals.map(h => ({ name: h.name, id: h.id })));
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
