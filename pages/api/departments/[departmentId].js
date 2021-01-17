import prisma from '../../../lib/prisma';
import Roles from '../../../lib/constants';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'GET') {
    if (!session.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      res.statusCode = 403;
      return res.end(
        'You do not have permission to view individual departments'
      );
    }

    const includes = {};

    if (session.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      includes.clinician_join_codes = { select: { code: true } };
    }

    const department = await prisma.departments.findMany({
      where: { id: +req.query.departmentId },
      include: includes,
    });

    return res.json(department);
  }

  if (req.method === 'DELETE') {
    if (!session.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      res.statusCode = 403;
      return res.end('You do not have permission to delete departments');
    }

    const isDepartmentInHospital = await prisma.departments.count({
      where: {
        AND: [
          { id: { equals: +req.query.departmentId } },
          { hospital_id: { equals: session.user.hospitalId } },
        ],
      },
    });

    if (!isDepartmentInHospital) {
      res.statusCode = 403;
      return res.end('You do not have permission to delete this department');
    }

    const responses = await Promise.all([
      prisma.departments.update({
        data: { archived: true },
        where: { id: +req.query.departmentId },
      }),
      prisma.question_urls.deleteMany({
        where: { department_id: { equals: +req.query.departmentId } },
      }),
    ]);

    return res.json({ success: responses.every(r => !!r) });
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
