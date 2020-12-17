import prisma from '../../lib/prisma';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    res.end('Unauthorized access');
    return;
  }

  if (req.method === 'GET') {
    const {
      from,
      to,
      department_id: departmentId,
      user_id: userId,
      hospital_id: hospitalId,
      health_board_id: healthBoardId,
    } = req.query;

    const filters = [];
    if (from) filters.push({ timestamp: { gte: new Date(from) } });
    if (to) filters.push({ timestamp: { lte: new Date(to) } });
    if (userId) filters.push({ user_id: { equals: +userId } });
    if (departmentId)
      filters.push({ department_id: { equals: +departmentId } });

    if (hospitalId) {
      filters.push({ departments: { hospital_id: { equals: +hospitalId } } });
    }

    if (healthBoardId) {
      filters.push({
        departments: {
          hospitals: { health_board_id: { equals: +healthBoardId } },
        },
      });
    }

    if (filters.length) {
      return res.json(
        await prisma.responses.findMany({ where: { AND: filters } })
      );
    } else {
      return res.json(await prisma.responses.findMany());
    }
  }

  if (req.method === 'POST') {
    const scores = req.body.scores.map(scoreObj => {
      return {
        standards: { connect: { id: scoreObj.standardId } },
        score: scoreObj.score,
      };
    });

    const words = req.body.words.map(word => {
      return {
        questions: { connect: { id: word.questionId } },
        word: word.word,
      };
    });

    const insertion = await prisma.responses.create({
      data: {
        users: { connect: { id: req.body.user_id } },
        timestamp: new Date(),
        departments: { connect: { id: req.body.department_id } },
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
