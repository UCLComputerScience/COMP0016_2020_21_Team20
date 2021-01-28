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
    return res.status(404).json({ error: true, message: 'Route not found' });
  }

  if (req.method === 'PUT') {
    if (!session.user.roles.includes(type)) {
      return res.status(403).json({
        error: true,
        message: `You do not have permission to modify ${
          type === Roles.USER_TYPE_DEPARTMENT
            ? 'department-level'
            : 'clinician-level'
        } join codes`,
      });
    }

    if (
      type === Roles.USER_TYPE_DEPARTMENT &&
      +departmentId !== session.user.departmentId
    ) {
      return res.status(403).json({
        error: true,
        message:
          'You do not have permission to modify join codes for a department you do not belong to',
      });
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

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
