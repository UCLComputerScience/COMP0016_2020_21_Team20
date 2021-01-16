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
        clinician_join_codes: { create: { code: await createJoinCode() } },
        department_join_codes: { create: { code: await createJoinCode() } },
      },
      include: {
        department_join_codes: { select: { code: true } },
        clinician_join_codes: { select: { code: true } },
      },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const isHospital = session.roles.includes(roles.USER_TYPE_HOSPITAL);
    const isHealthBoard = session.roles.includes(roles.USER_TYPE_HEALTH_BOARD);

    if (!isHospital && !isHealthBoard) {
      res.statusCode = 403;
      return res.end('You do not have permission to view departments');
    }

    const where = { archived: { equals: false } };
    if (isHospital) {
      where.hospital_id = session.user.hospitalId;
    } else {
      where.hospitals = {
        health_board_id: { equals: session.user.healthBoardId },
      };
    }

    const departments = await prisma.departments.findMany({
      include: { department_join_codes: true },
      where,
    });

    // Only return the name, join code and id of the department
    return res.json(
      departments.map(d => ({
        name: d.name,
        department_join_code: d.department_join_codes.code,
        id: d.id,
      }))
    );
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
