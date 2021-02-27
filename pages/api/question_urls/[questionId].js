import prisma from '../../../lib/prisma';
import { Roles } from '../../../lib/constants';
import requiresAuth from '../../../lib/requiresAuthApiMiddleware';

/**
 * @swagger
 * tags:
 *  name: question_urls
 *  description: Self-report question department training URLs
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    question:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        body:
 *          type: string
 *          example: I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.
 *        type:
 *          type: string
 *          example: likert_scale
 *        standards:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              example: 1
 *            name:
 *              type: string
 *              example: Individual Care
 *        url:
 *          type: string
 *          example: http://www.wales.nhs.uk/governance-emanual/person-centred-care
 */

/**
 * @swagger
 * /question_urls/{id}:
 *  put:
 *    summary: Update a question's training URL for your department
 *    description: "Update the given question's training URL for all users in your department, to be shown to them when they self-report. Note: you must be a department manager to perform this operation."
 *    tags: [question_urls]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Question ID to update training URL for
 *        required: true
 *        schema:
 *          type: integer
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              url:
 *                type: string
 *                example: http://www.wales.nhs.uk/governance-emanual/person-centred-care
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/operationResult'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      422:
 *        $ref: '#/components/responses/invalid_question_id'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  delete:
 *    summary: Delete your department's training URL for a question
 *    description: "Delete the given question's department-specific training URL, resetting it to the default global training URL for all users in your department when they self-report. to no longer be shown to any users when they self-report. Note: you must be a department manager to perform this operation."
 *    tags: [question_urls]
 *    parameters:
 *      - name: id
 *        in: path
 *        description: Question ID to delete training URL for
 *        required: true
 *        schema:
 *          type: integer
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/operationResult'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      403:
 *        $ref: '#/components/responses/insufficient_permission'
 *      422:
 *        $ref: '#/components/responses/invalid_question_id'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;
  const { questionId } = req.query;

  if (isNaN(questionId)) {
    return res
      .status(422)
      .json({ error: true, message: 'Invalid question ID provided' });
  }

  if (req.method === 'PUT') {
    if (!session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to modify question URLs',
      });
    }

    const { url } = req.body;
    if (!url) {
      return res.status(422).json({ error: true, message: 'No URL provided' });
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

    return res.json({ success: response && response.url === url });
  }

  if (req.method === 'DELETE') {
    if (!session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return res.status(403).json({
        error: true,
        message: 'You do not have permission to delete question URLs',
      });
    }

    const response = await prisma.question_urls.delete({
      where: {
        question_id_department_id: {
          question_id: +questionId,
          department_id: session.user.departmentId,
        },
      },
    });

    return res.json({ success: response && response.url === null });
  }

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
