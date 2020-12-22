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
    const queryParams = {
      id: true,
      body: true,
      default_url: true,
      type: true,
      standard_id: true,
    };

    // Handle the `default_urls` override to always fetch the default URL
    if (req.query.default_urls !== '1') {
      queryParams.question_urls = {
        select: { url: true },
        where: { department_id: session.departmentId },
      };
    }

    const questions = await prisma.questions.findMany({
      select: queryParams,
    });

    // Return an object with keys as question types, and values as arrays of questions with each type
    // e.g. { likert_scale: [{...}, {...}], words: [{...}, {...}] }
    const questionsToReturn = questions.reduce((result, question) => {
      // Only return a single URL: custom URL if it exists, else the default one
      if (question.question_urls && question.question_urls.length) {
        question.url = question.question_urls[0].url;
      } else {
        question.url = question.default_url;
      }

      delete question.question_urls;
      delete question.default_url;

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
