import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import createJoinCode from '../../../lib/createJoinCode';
import { Roles } from '../../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: departments
 *  description: Departments in the system
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    department:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        name:
 *          type: string
 *          example: Physiotherapy
 *        department_join_code:
 *          type: string
 *          example: AgH-Cda-rOC
 */

/**
 * @swagger
 * /departments:
 *  get:
 *    summary: Retrieve the list of departments
 *    description: "Retrieve the list of departments in the system, for your hospital or health board. Note: you must be a hospital or health board user to perform this operation."
 *    tags: [departments]
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
 *  post:
 *    summary: Add a new department
 *    description: "Add a new department to the system, to be automatically tied to your hospital. Note: you must be a hospital user to perform this operation."
 *    tags: [departments]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Physiotherapy
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/department'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      422:
 *        description: Invalid details
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/error'
 *            example:
 *              error: true
 *              message: The required department details are missing
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add new departments',
      });
    }

    const { name } = req.body;
    if (!name) {
      return res.status(422).json({
        error: true,
        message: 'The required department details are missing',
      });
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
    const isHospital = session.user.roles.includes(Roles.USER_TYPE_HOSPITAL);
    const isHealthBoard = session.user.roles.includes(
      Roles.USER_TYPE_HEALTH_BOARD
    );

    if (!isHospital && !isHealthBoard) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view departments',
      });
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

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
