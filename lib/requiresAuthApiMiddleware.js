import { getSession } from 'next-auth/client';

const requiresAuth = handler => async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  req.session = session;
  return handler(req, res);
};

export default requiresAuth;
