import roles from '../../../lib/roles';
import setUserDepartmentAndRole from '../../../lib/setUserDepartmentAndRole';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'POST') {
    if (
      !session.roles.includes(roles.USER_TYPE_DEPARTMENT) &&
      !session.roles.includes(roles.USER_TYPE_CLINICIAN)
    ) {
      res.statusCode = 403;
      return res.end('You do not belong to a specific department');
    }

    const result = await setUserDepartmentAndRole({
      session,
      newUserType: roles.USER_TYPE_UNKNOWN,
    });
    return res.json({ success: result });
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
