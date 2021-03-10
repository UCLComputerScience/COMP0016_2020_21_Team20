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
 *        health_board
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
    // TODO return as object with key `hospitals` and value the array:
    return res.json(
      hospitals.map(h => ({
        name: h.name,
        id: h.id,
        health_board: h.health_boards,
      }))
    );
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
