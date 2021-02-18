import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * /departments/{id}:
 *  get:
 *    summary: Retrieve a single department
 *    description: "Retrieve the details of a single departments in the system, for your hospital, health board or department. Note: you must be a hospital, health board or department user to perform this operation, and `id` must be your own department, or a department within your hospital/health board."
 *    tags: [departments]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The department ID to update the Join Code for (it must be in your hospital)
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/department'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  delete:
 *    summary: Delete a department
 *    description: "Delete a department from the system, and automatically un-link existing clinicians/managers for this department. This is irreversible. Clinicians and department managers will need to join a new department to continue using the platform. Note: you must be a hospital user to perform this operation."
 *    tags: [departments]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: The department ID to update the Join Code for (it must be in your hospital)
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/operationResult'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    if (session.user.roles.includes(Roles.USER_TYPE_CLINICIAN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view individual departments',
      });
    }

    const includes = {};
    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      if (+req.query.departmentId !== session.user.departmentId) {
        return res.status(403).json({
          error: true,
          message:
            'You do not have permission to view a department you do not belong to',
        });
      }
      includes.clinician_join_codes = { select: { code: true } };
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      const isDepartmentInHospital = await prisma.departments.count({
        where: {
          AND: [
            { id: { equals: +req.query.departmentId } },
            { hospital_id: { equals: session.user.hospitalId } },
          ],
        },
      });

      if (!isDepartmentInHospital) {
        return res.status(403).json({
          error: true,
          message:
            'You do not have permission to view a department that is not in your hospital',
        });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      const isDepartmentInHealthBoard = await prisma.departments.count({
        where: {
          AND: [
            { id: { equals: +req.query.departmentId } },
            { health_board_id: { equals: session.user.healthBoardId } },
          ],
        },
      });

      if (!isDepartmentInHealthBoard) {
        return res.status(403).json({
          error: true,
          message:
            'You do not have permission to view a department that is not in your health board',
        });
      }
    }

    const department = await prisma.departments.findMany({
      where: { id: +req.query.departmentId },
      include: includes,
    });

    return res.json(department);
  }

  if (req.method === 'DELETE') {
    if (!session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete departments',
      });
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
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete this department',
      });
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

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
