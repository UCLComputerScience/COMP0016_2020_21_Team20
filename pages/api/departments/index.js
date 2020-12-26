import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';
import createJoinCode from '../../../lib/createJoinCode';

import { getSession } from 'next-auth/client';

// TODO do we want to add an override to these methods to allow a health board/admin user to specify which hospital?
// Or should it be tied to the session.user.hospitalId (as currently implemented)
export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'POST') {
    if (!session.roles.includes(roles.USER_TYPE_HOSPITAL)) {
      res.statusCode = 403;
      return res.end('You do not have permission to add new departments');
    }

    const { name } = req.body;
    if (!name) {
      res.statusCode = 422;
      return res.end('The required department details are missing');
    }

    const record = await prisma.departments.create({
      data: {
        name: name,
        hospitals: { connect: { id: session.user.hospitalId } },
        join_codes: {
          create: {
            department_join_code: await createJoinCode(),
            clinician_join_code: await createJoinCode(),
          },
        },
      },
      include: {
        join_codes: {
          select: {
            department_join_code: true,
            clinician_join_code: true,
          },
        },
      },
    });

    return res.json(record);
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
