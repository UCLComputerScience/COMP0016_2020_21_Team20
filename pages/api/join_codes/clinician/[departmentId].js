import prisma from '../../../../lib/prisma';
import roles from '../../../../lib/roles';
import createJoinCode from '../../../../lib/createJoinCode';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  const { departmentId } = req.query;

  if (req.method === 'PUT') {
    if (!session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
      res.statusCode = 403;
      return res.end(
        'You do not have permission to modify clinician-level join codes'
      );
    }

    const code = await createJoinCode();
    await prisma.clinician_join_codes.upsert({
      create: {
        departments: { connect: departmentId },
        code,
      },
      update: { code },
      where: { department_id: departmentId },
    });

    return res.json({ code });
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
