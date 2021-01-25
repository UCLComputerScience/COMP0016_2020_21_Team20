import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import setUserDepartmentAndRole from '../../../lib/setUserDepartmentAndRole';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'POST') {
    if (
      !session.roles.includes(Roles.USER_TYPE_DEPARTMENT) &&
      !session.roles.includes(Roles.USER_TYPE_CLINICIAN)
    ) {
      res.statusCode = 403;
      return res.end('You do not belong to a specific department');
    }

    const result = await setUserDepartmentAndRole({
      userId: session.user.userId,
      newUserType: Roles.USER_TYPE_UNKNOWN,
    });
    return res.json({ success: result });
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
};

export default requiresAuth(handler);
