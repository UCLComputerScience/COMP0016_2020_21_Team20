import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';

/**
 * @swagger
 * tags:
 *  name: recent_words
 *  description: Recently Submitted single-words
 */

/**
 * @swagger
 * /recent_words:
 *  get:
 *    summary: Retrieve a list of the recently submitted words
 *    description: Retrieve a list of the most recent 100 words that were submitted by users, anonymised. This can be used for e.g. populating an autocomplete input field
 *    tags: [recent_words]
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: array
 *              items:
 *                type: string
 *                example: tiring
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
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
