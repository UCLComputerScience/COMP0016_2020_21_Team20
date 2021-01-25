import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import createJoinCode from '../../../lib/createJoinCode';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;
  const { params } = req.query;
  const [type, departmentId] = params;

  if (
    ![Roles.USER_TYPE_DEPARTMENT, Roles.USER_TYPE_HOSPITAL].includes(type) ||
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
           type === Roles.USER_TYPE_DEPARTMENT
             ? 'department-level'
             : 'clinician-level'
         } join codes`
      );
    }

    if (
      type === Roles.USER_TYPE_DEPARTMENT &&
      +departmentId !== session.user.departmentId
    ) {
      return res.end(
        'You do not have permission to modify join codes for a department you do not belong to'
      );
    }

    const code = await createJoinCode();
    const dbTable =
      type === Roles.USER_TYPE_HOSPITAL
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
};

export default requiresAuth(handler);
