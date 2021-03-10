import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import { addNewUser } from '../../lib/handleUserAuthEvents';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: users
 *  description: Users in the system
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    user:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        email:
 *          type: string
 *          example: The Grange University Hospital
 */

/**
 * @swagger
 * /users:
 *  post:
 *    summary: Add a new user
 *    description: "Add a new user to the system. Note: you must be an administrator to be able to perform this operation, and you can only add `health_board` or `hospital` user types."
 *    tags: [users]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              email:
 *                type: string
 *                example: "clinician@example.com"
 *              password:
 *                type: string
 *                example: dGBZqURXue
 *              user_type:
 *                type: string
 *                example: health_board
 *              entity_id:
 *                type: integer
 *                example: 1
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                success:
 *                  type: boolean
 *                  example: true
 *                user_id:
 *                  type: string
 *                  example: bc482583-8a76-45de-9145-c64cbf689704
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
 *              message: The required user details are missing
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to add users to the system',
      });
    }

    const {
      email,
      password,
      user_type: userType,
      entity_id: entityId,
    } = req.body;

    if (!email || !password || !userType || !entityId) {
      return res.status(422).json({
        error: true,
        message: 'The required user details are missing',
      });
    }

    const result = await addNewUser({ email, password, entityId, userType });
    if (result) {
      return res.json({ success: true, user_id: result });
    } else {
      return res.json({ success: false });
    }
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
