import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: hospitals
 *  description: Hospitals in the system
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    hospital:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        name:
 *          type: string
 *          example: The Grange University Hospital
 *        health_board:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              example: 1
 *            name:
 *              type: string
 *              example: Aneurin Bevan
 */

/**
 * @swagger
 * /hospitals:
 *  get:
 *    summary: Retrieve a list of hospitals
 *    description: "Retrieve a list of hospitals. Note: only health board users can use this endpoint to fetch hospitals inside their own health board, or platform administrators to view all hospitals in the system. This could be used e.g. for populating a list of hospitals for them to filter by when visualising statistics."
 *    tags: [hospitals]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/hospital'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  post:
 *    summary: Add a new hospital
 *    description: "Add a new hospital to the system. Note: you must be an administrator to be able to perform this operation."
 *    tags: [hospitals]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              name:
 *                type: string
 *                example: Royal Grent
 *              health_board_id:
 *                type: integer
 *                example: 1
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/hospital'
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
 *              message: The required hospital details are missing
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    if (
      !session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD) &&
      !session.user.roles.includes(Roles.USER_TYPE_ADMIN)
    ) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to view hospitals',
      });
    }

    let where = {};
    if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      where = { health_board_id: { equals: session.user.healthBoardId } };
    }

    const hospitals = await prisma.hospitals.findMany({
      where,
      select: {
        health_boards: { select: { name: true, id: true } },
        id: true,
        name: true,
      },
      orderBy: { id: 'asc' },
    });

    // Return the name, id and health board of the hospital
    return res.json(
      hospitals.map(h => ({
        name: h.name,
        id: h.id,
        health_board: h.health_boards,
      }))
    );
  }

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add hospitals to the system',
      });
    }

    const { name, health_board_id: healthBoardId } = req.body;
    if (!name || !healthBoardId) {
      return res.status(422).json({
        error: true,
        message: 'The required hospital details are missing',
      });
    }

    const record = await prisma.hospitals.create({
      data: { name, health_board_id: healthBoardId },
    });

    return res.json(record);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
