import requiresAuth from '../../lib/requiresAuthApiMiddleware';
import prisma from '../../lib/prisma';
import { Roles } from '../../lib/constants';

/**
 * @swagger
 * tags:
 *  name: responses
 *  description: Self-report responses
 */

/**
 * @swagger
 * components:
 *  schemas:
 *    response:
 *      properties:
 *        id:
 *         type: integer
 *         example: 1
 *        timestamp:
 *          type: string
 *          example: 2020-12-01T13:00:00.000Z
 *        is_mentoring_session:
 *          type: boolean
 *          example: false
 *        departments:
 *          type: object
 *          properties:
 *            id:
 *              type: integer
 *              example: 1
 *            name:
 *              type: string
 *              example: Band 5 Physiotherapist
 *            hospital_id:
 *              type: integer
 *              example: 1
 *            archived:
 *              type: boolean
 *              example: false
 *        words:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              id:
 *                type: integer
 *                example: 1
 *              response_id:
 *                type: integer
 *                example: 1
 *              word:
 *                type: string
 *                example: complex
 *              question_id:
 *                type: integer
 *                example: 1
 *        scores:
 *          type: array
 *          items:
 *            type: object
 *            properties:
 *              standards:
 *                type: object
 *                properties:
 *                  id:
 *                    type: integer
 *                    example: 6
 *                  name:
 *                    type: string
 *                    example: Timely Care
 *              score:
 *                type: integer
 *                example: 4
 */

/**
 * @swagger
 * /responses:
 *  get:
 *    summary: Retrieve the self-report responses
 *    description: Retrieve the list of responses stored in the system, according to the specified filters
 *    tags: [responses]
 *    parameters:
 *      - in: query
 *        name: from
 *        schema:
 *          type: integer
 *        required: false
 *        description: Unix Epoch timestamp (milliseconds) representing the start date you want responses from
 *      - in: query
 *        name: to
 *        schema:
 *          type: integer
 *        required: false
 *        description: Unix Epoch timestamp (milliseconds) representing the end date you want responses to
 *      - in: query
 *        name: only_is_mentoring_session
 *        schema:
 *          type: string
 *        required: false
 *        example: 1
 *        description: Whether you want responses only for mentoring sessions (this takes precedence over only_not_mentoring_session)
 *      - in: query
 *        name: only_not_mentoring_session
 *        schema:
 *          type: string
 *        required: false
 *        example: 1
 *        description: Whether you want responses only for non-mentoring sessions (overriden by only_not_mentoring_session if provided)
 *      - in: query
 *        name: user_id
 *        schema:
 *          type: integer
 *        required: false
 *        example: 1
 *        description: "The user ID you want to fetch responses for (overrides the default which is to return responses relevant to your user type). Note: this is only relevant for department manager user types."
 *      - in: query
 *        name: department_id
 *        schema:
 *          type: integer
 *        required: false
 *        example: 1
 *        description: "The department ID you want to fetch responses for (overrides the default which is to return responses relevant to your user type). Note: this is only relevant for hospital user types."
 *      - in: query
 *        name: hospital_id
 *        schema:
 *          type: integer
 *        required: false
 *        example: 1
 *        description: "The department ID you want to fetch responses for (overrides the default which is to return responses relevant to your user type). Note: this is only relevant for health board user types."
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              type: object
 *              properties:
 *                responses:
 *                  type: array
 *                  items:
 *                    $ref: '#/components/schemas/response'
 *                averages:
 *                  type: object
 *                  additionalProperties:
 *                    type: number
 *
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 *  post:
 *    summary: Submit a self-report response
 *    description: Submit a self-report response to be associated with the logged in user
 *    tags: [responses]
 *    requestBody:
 *      required: true
 *      content:
 *        application/json:
 *          schema:
 *            type: object
 *            properties:
 *              scores:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    standardId:
 *                      type: integer
 *                      example: 6
 *                    score:
 *                      type: integer
 *                      example: 2
 *              words:
 *                type: array
 *                items:
 *                  type: object
 *                  properties:
 *                    questionId:
 *                      type: integer
 *                      example: 8
 *                    word:
 *                      type: string
 *                      example: tiring
 *              is_mentoring_session:
 *                type: boolean
 *                example: true
 *    responses:
 *      200:
 *        description: Success
 *        content:
 *          application/json:
 *            schema:
 *              $ref: '#/components/schemas/response'
 *      401:
 *        $ref: '#/components/responses/unauthorized'
 *      500:
 *        $ref: '#/components/responses/internal_server_error'
 */
const handler = async (req, res) => {
  const { session } = req;

  if (req.method === 'GET') {
    const {
      from,
      to,
      only_is_mentoring_session: onlyIsMentoringSession,
      only_not_mentoring_session: onlyNotMentoringSession,

      user_id: userIdOverride,
      department_id: departmentIdOverride,
      hospital_id: hospitalIdOverride,
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

    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      if (!session.user.departmentId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: { id: { equals: session.user.departmentId } },
      });

      if (userIdOverride && userIdOverride === session.user.userId) {
        filters.push({ user_id: { equals: session.user.userId } });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      if (!session.user.hospitalId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: { hospital_id: { equals: session.user.hospitalId } },
      });

      if (departmentIdOverride) {
        filters.push({
          departments: { id: { equals: +departmentIdOverride } },
        });
      }
    } else if (session.user.roles.includes(Roles.USER_TYPE_HEALTH_BOARD)) {
      if (!session.user.healthBoardId) {
        return res.json({ responses: [], averages: {} });
      }

      filters.push({
        departments: {
          hospitals: {
            health_board_id: { equals: session.user.healthBoardId },
          },
        },
      });

      if (hospitalIdOverride) {
        filters.push({
          departments: { hospitals: { id: { equals: +hospitalIdOverride } } },
        });
      }
    } else {
      if (!session.user.userId) {
        return res.json({ responses: [], averages: {} });
      }

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

    const orderBy = { timestamp: 'asc' };

    const responses = filters.length
      ? await prisma.responses.findMany({
          where: { AND: filters },
          select,
          orderBy,
        })
      : await prisma.responses.findMany({ select, orderBy });

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
        word: word.word.toLowerCase(),
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

  res.status(405).json({ error: true, message: 'Method Not Allowed' });
};

export default requiresAuth(handler);
