import prisma from '../../../lib/prisma';
import roles from '../../../lib/roles';

import { getSession } from 'next-auth/client';

export default async function handler(req, res) {
  const session = await getSession({ req });

  if (!session) {
    res.status = 401;
    return res.end('Unauthorized access');
  }

  const { questionId } = req.query;

  if (isNaN(questionId)) {
    res.statusCode = 422;
    return res.end('Invalid question ID provided');
  }

  if (req.method === 'PUT') {
    if (
      !session.roles.includes(roles.USER_TYPE_DEPARTMENT) ||
      !session.roles.includes(roles.USER_TYPE_ADMIN)
    ) {
      res.statusCode = 403;
      return res.end('You do not have permission to modify questions');
    }

    const { body, url, standard } = req.body;
    if (!body && !url && !standard) {
      res.statusCode = 422;
      return res.end('The required question details are missing');
    }

    const fields = {};
    if (url) fields.question_url = url;
    if (body) fields.question_body = body;
    if (standard) fields.standards = { connect: { id: standard } };

    const response = await prisma.questions.update({
      where: { id: +questionId },
      data: fields,
    });

    return res.json(response);
  }

  res.statusCode = 405;
  return res.end('HTTP Method Not Allowed');
}
