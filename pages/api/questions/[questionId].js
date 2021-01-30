import requiresAuth from '../../../lib/requiresAuthApiMiddleware';
import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';

const handler = async (req, res) => {
  const { session } = req;
  const { questionId } = req.query;

  if (isNaN(questionId)) {
    return res
      .status(422)
      .json({ error: true, message: 'Invalid question ID provided' });
  }

  if (req.method === 'PUT') {
    if (
      !session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) &&
      !session.user.roles.includes(Roles.USER_TYPE_ADMIN)
    ) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to modify questions',
      });
    }

    const { body, url, standard } = req.body;
    if (!body && !url && !standard) {
      return res.status(422).json({
        error: true,
        message: 'The required question details are missing',
      });
    }

    // Note: we don't support changing the standard of a question (otherwise users will
    // answer the same question but scores will be recorded against different standards,
    // skewing the results)
    const fields = {};
    if (url) fields.default_url = url;
    if (body) fields.body = body;

    const response = await prisma.questions.update({
      where: { id: +questionId },
      data: fields,
    });

    return res.json(response);
  }

  if (req.method === 'DELETE') {
    if (!session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete questions',
      });
    }

    const response = await prisma.questions.update({
      data: { archived: true },
      where: { id: +questionId },
    });

    return res.json(response);
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
