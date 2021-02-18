import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import setUserDepartmentAndRole from '../../../lib/setUserDepartmentAndRole';
import { Roles } from '../../../lib/constants';

/**
 * @swagger
 * /departments/leave:
 *  post:
 *    summary: Leave your department
 *    description: "Leave your department in the system. This is irreversible. You must later join a new department to continue using the platform. Note: you must be a department or clinician user to perform this operation."
 *    tags: [departments]
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

  if (req.method === 'POST') {
    if (
      !session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) &&
      !session.user.roles.includes(Roles.USER_TYPE_CLINICIAN)
    ) {
      return res.status(403).json({
        error: true,
        message: 'You do not belong to a specific department',
      });
    }

    const result = await setUserDepartmentAndRole({
      userId: session.user.userId,
      newUserType: Roles.USER_TYPE_UNKNOWN,
    });
    return res.json({ success: result });
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
