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
    const { from, to } = req.query;
    const filters = [];

    if (from) filters.push({ timestamp: { gte: new Date(from) } });
    if (to) filters.push({ timestamp: { lte: new Date(to) } });

    if (session.user.departmentId) {
      filters.push({ department_id: { equals: session.user.departmentId } });
    } else if (session.user.hospitalId) {
      // TODO as below
      filters.push({
        departments: { hospital_id: { equals: session.user.hospitalId } },
      });
    } else if (session.user.healthBoardId) {
      // TODO do we want health boards to also see hospital-level/department-level data?
      // If so, pass in a department_id/hospital_id parameter to override this
      filters.push({
        departments: {
          hospitals: {
            health_board_id: { equals: session.user.healthBoardId },
          },
        },
      });
    } else {
      // Default to lowest-level i.e. logged in user's data
      filters.push({ user_id: { equals: session.user.userId } });
    }

    if (filters.length) {
      return res.json(
        await prisma.responses.findMany({
          where: { AND: filters },
          select: {
            id: true,
            timestamp: true,
            is_mentoring_session: true,
            departments: true,
            words: true,
            scores: {
              select: {
                standards: true,
                score: true,
                id: true,
              },
            },
          },
        })
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
        users: { connect: { id: session.user.userId } },
        timestamp: new Date(),
        departments: { connect: { id: session.user.departmentId } },
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
