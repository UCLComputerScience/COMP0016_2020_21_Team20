import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import createJoinCode from '../../../lib/createJoinCode';
import { Roles } from '../../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: join_codes
 *  description: Department join codes
 */

/**
 * @swagger
 * /join_codes/department_manager/{id}:
 *  put:
 *    summary: Update your department's Join Code (URL) for clinicians
 *    description: "Update the Join Code (URL) for your department's clinicians, to allow them to join your department. Note: this invalidates any previous Join URL and will need to be redistributed. Note: you must be a department manager to perform this operation and `id` must be your own department ID."
 *    tags: [join_codes]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Your department ID (to update the Join Code for)
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  example: AgH-Cda-rOC
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 * /join_codes/hospital/{id}:
 *  put:
 *    summary: Update the Join Code for a department in your hospital
 *    description: "Update the Join Code (URL) for a department in your hospital, to allow the corresponding department managers to join the department. Note: this invalidates any previous Join URL and will need to be redistributed. Note: you must be a hospital user to perform this operation and `id` must be a department ID in your hospital."
 *    tags: [join_codes]
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
 *              type: object
 *              properties:
 *                code:
 *                  type: string
 *                  example: AgH-Cda-rOC
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
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
    } else if (type === Roles.USER_TYPE_HOSPITAL) {
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
            'You do not have permission to modify join codes for a department that is not in your hospital',
        });
      }
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
