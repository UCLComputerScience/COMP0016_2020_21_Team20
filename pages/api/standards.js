import prisma from '../../lib/prisma';

import requiresAuth from '../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * tags:
 *  name: standards
 *  description: Health & Care Standards
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    standard:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        name:
 *          type: string
 *          example: Timely Care
 */

/**
 * @swagger
 * /standards:
 *  get:
 *    summary: Retrieve the list of standards stored in the system
 *    description: Retrieve the list of standards stored in the system, with their ID and name
 *    tags: [standards]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                $ref: '#/components/schemas/standard'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  if (req.method === 'GET') {
    const standards = await prisma.standards.findMany();
    // TODO return as object with key `standards` and value the array:
    return res.json(standards);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
