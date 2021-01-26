import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';

const handler = async (req, res) => {
  // Return a list of recently used words
  if (req.method === 'GET') {
    const words = await prisma.responses.findMany({
      select: { words: true },
      take: 100,
    });

    return res.json({
      words: [
        ...new Set(
          words
            .map(w => w.words.map(word => word.word.toLowerCase()))
            .reduce((acc, val) => [...acc, ...val], [])
        ),
      ],
    });
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
