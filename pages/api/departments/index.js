import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'GET') {
    if (!session.roles.includes(roles.USER_TYPE_HOSPITAL)) {
      res.statusCode = 403;
      return res.end('You do not have permission to view departments');
    }

    const departments = await prisma.departments.findMany({
      where: { hospital_id: session.user.hospitalId },
    });

    // Only return the name and id of the department
    return res.json(departments.map(d => ({ id: d.id, name: d.name })));
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
