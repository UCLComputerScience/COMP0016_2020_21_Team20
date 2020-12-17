import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    return res.end('Unauthorized access');
  }

  if (req.method === 'POST') {
    if (!session.roles.includes(roles.USER_TYPE_ADMIN)) {
      res.statusCode = 403;
      return res.end('You do not have permission to add new questions');
    }

    const { body, url, standard, type } = req.body;
    if (!body || !url || !standard || !type) {
      res.statusCode = 422;
      return res.end('The required question details are missing');
    }

    const record = await prisma.questions.create({
      data: {
        body: body,
        default_url: url,
        standards: { connect: { id: standard } },
        type: type,
      },
    });

    return res.json(record);
  }

  if (req.method === 'GET') {
    const questions = await prisma.questions.findMany();

    // Return an object with keys as question types, and values as arrays of questions with each type
    // e.g. { likert_scale: [{...}, {...}], words: [{...}, {...}] }
    const questionsToReturn = questions.reduce((result, question) => {
      if (result[question.type]) {
        result[question.type].push(question);
      } else {
        result[question.type] = [question];
      }
      return result;
    }, {});

    return res.json(questionsToReturn);
  }

  res.statusCode = 405;
  return res.end('HTTP Method Not Allowed');
}
