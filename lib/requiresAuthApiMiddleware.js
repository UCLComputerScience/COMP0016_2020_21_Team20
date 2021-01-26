import { getSession } from 'next-auth/client';

const requiresAuth = handler => async (req, res) => {
  const session = await getSession({ req });

  if (!session) {
    return res
      .status(401)
      .json({ error: true, message: 'Unauthorized access' });
  }

  req.session = session;
  try {
    return await handler(req, res);
  } catch (err) {
    console.error('API route unhandled error', err);
    return res.status(500).json({
      error: true,
      message:
        'An unexpected error occurred. Please try again later or contact the system administrator if the error persists.',
    });
  }
};

export default requiresAuth;
