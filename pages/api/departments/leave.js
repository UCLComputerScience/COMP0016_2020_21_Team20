import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import setUserDepartmentAndRole from '../../../lib/setUserDepartmentAndRole';
import { Roles } from '../../../lib/constants';

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
