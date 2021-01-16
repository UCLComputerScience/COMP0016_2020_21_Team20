import prisma from '../../lib/prisma';

import { getSession } from 'next-auth/client';

import { UserGroups } from '../../lib/constants';
import roles from '../../lib/roles';

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
      only_is_mentoring_session: onlyIsMentoringSession,
      only_not_mentoring_session: onlyNotMentoringSession,
      user_group: userGroup,
    } = req.query;

    const filters = [];

    if (from) filters.push({ timestamp: { gte: new Date(+from) } });
    if (to) filters.push({ timestamp: { lte: new Date(+to) } });

    // Default will be with BOTH included
    if (onlyIsMentoringSession === '1') {
      filters.push({ is_mentoring_session: true });
    } else if (onlyNotMentoringSession === '1') {
      filters.push({ is_mentoring_session: false });
    }

    if (session.roles.includes(roles.USER_TYPE_DEPARTMENT)) {
      if (userGroup === UserGroups.MYSELF) {
        filters.push({ user_id: { equals: session.user.userId } });
      } else {
        filters.push({ department_id: { equals: session.user.departmentId } });
      }
    } else if (session.roles.includes(roles.USER_TYPE_HOSPITAL)) {
      // TODO as below
      filters.push({
        departments: { hospital_id: { equals: session.user.hospitalId } },
      });
    } else if (session.roles.includes(roles.USER_TYPE_HEALTH_BOARD)) {
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

    const select = {
      id: true,
      timestamp: true,
      is_mentoring_session: true,
      departments: true,
      words: true,
      scores: { select: { standards: true, score: true } },
    };

    const responses = filters.length
      ? await prisma.responses.findMany({ where: { AND: filters }, select })
      : await prisma.responses.findMany({ select });

    const scoresPerStandard = {};
    responses.forEach(val =>
      val.scores.forEach(score => {
        if (scoresPerStandard[score.standards.name]) {
          scoresPerStandard[score.standards.name].push(score.score);
        } else {
          scoresPerStandard[score.standards.name] = [score.score];
        }
      })
    );

    const responseData = { responses, averages: {} };
    Object.entries(scoresPerStandard).map(
      ([standard, scores]) =>
        (responseData.averages[standard] =
          scores.reduce((acc, val) => acc + val, 0) / scores.length)
    );

    return res.json(responseData);
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
