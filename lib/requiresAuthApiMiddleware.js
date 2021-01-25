import { getSession } from 'next-auth/client';

const requiresAuth = handler => async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  req.session = session;
  try {
    return await handler(req, res);
  } catch (err) {
    console.error('API route unhandled error', err);
    res.statusCode = 500;
    return res.json({
      error: true,
      message:
        'An unexpected error occurred. Please try again later or contact the system administrator if the error persists.',
    });
  }
};

export default requiresAuth;
