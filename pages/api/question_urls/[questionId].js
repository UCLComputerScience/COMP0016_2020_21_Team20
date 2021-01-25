import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

const handler = async (req, res) => {
  const { session } = req;
  const { questionId } = req.query;

  if (isNaN(questionId)) {
    res.statusCode = 422;
    return res.end('Invalid question ID provided');
  }

  if (req.method === 'PUT') {
    if (!session.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      res.statusCode = 403;
      return res.end('You do not have permission to modify question URLs');
    }

    const { url } = req.body;
    if (!url) {
      res.statusCode = 422;
      return res.end('No URL provided');
    }

    const response = await prisma.question_urls.upsert({
      create: {
        url,
        departments: { connect: { id: session.user.departmentId } },
        questions: { connect: { id: +questionId } },
      },
      update: { url },
      where: {
        question_id_department_id: {
          question_id: +questionId,
          department_id: session.user.departmentId,
        },
      },
    });

    return res.json(response);
  }

  if (req.method === 'DELETE') {
    if (!session.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      res.statusCode = 403;
      return res.end('You do not have permission to delete question URLs');
    }

    const response = await prisma.question_urls.delete({
      where: {
        question_id_department_id: {
          question_id: +questionId,
          department_id: session.user.departmentId,
        },
      },
    });

    return res.json(response);
  }

  res.statusCode = 405;
  return res.end('HTTP Method Not Allowed');
};

export default requiresAuth(handler);
