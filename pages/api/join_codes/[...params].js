import { getSession } from 'next-auth/client';

import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';
import createJoinCode from '../../../lib/createJoinCode';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  const { params } = req.query;
  const [type, departmentId] = params;

  if (
    ![roles.USER_TYPE_DEPARTMENT, roles.USER_TYPE_HOSPITAL].includes(type) ||
    !departmentId
  ) {
    res.statusCode = 404;
    return res.end('Route not found');
  }

  if (req.method === 'PUT') {
    if (!session.roles.includes(type)) {
      res.statusCode = 403;
      return res.end(
        `You do not have permission to modify
         ${
           type === roles.USER_TYPE_DEPARTMENT
             ? 'department-level'
             : 'clinician-level'
         } join codes`
      );
    }

    const code = await createJoinCode();
    const dbTable =
      type === roles.USER_TYPE_HOSPITAL
        ? prisma.department_join_codes
        : prisma.clinician_join_codes;

    await dbTable.upsert({
      create: {
        departments: { connect: { id: +departmentId } },
        code,
      },
      update: { code },
      where: { department_id: +departmentId },
    });

    return res.json({ code });
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
