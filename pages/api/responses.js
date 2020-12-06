import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method === 'GET') {
    return res.json(await prisma.responses.findMany());
  }

  if (req.method === 'POST') {
    const scores = req.body.scores.map(scoreObj => {
      return {
        score: scoreObj.score,
        standards: { connect: { id: scoreObj.standardId } },
      };
    });

    const words = req.body.good_words.map(word => {
      return {
        word: word,
        questions: { connect: word.questionId },
      };
    });

    const insertion = await prisma.responses.create({
      data: {
        timestamp: new Date(),
        departments: { connect: { id: req.body.dept_id } },
        users: { connect: { id: req.body.user_id } },
        is_mentoring_session: req.body.is_mentoring_session,
        scores: { create: scores },
        words: { create: words },
      },
    });

    return res.json(insertion);
  }

  res.statusCode = 405;
  res.end('HTTP Method Not Allowed');
}
