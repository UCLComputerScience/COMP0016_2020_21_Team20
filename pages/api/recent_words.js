import { getSession } from 'next-auth/client';

import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    return res.end('Unauthorized access');
  }

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

  res.statusCode = 405;
  return res.end('HTTP Method Not Allowed');
}
