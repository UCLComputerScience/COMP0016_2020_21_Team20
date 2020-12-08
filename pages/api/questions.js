import prisma from '../../lib/prisma';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.statusCode = 405;
    res.end('HTTP Method Not Allowed');
    return;
  }

  const questions = await prisma.questions.findMany();

  // Return an object with keys as question types, and values as arrays of questions with each type
  // e.g. { likert_scale: [{...}, {...}], words: [{...}, {...}] }
  const questionsToReturn = questions.reduce((result, question) => {
    if (result[question.question_type]) {
      result[question.question_type].push(question);
    } else {
      result[question.question_type] = [question];
    }
    return result;
  }, {});

  return res.json(questionsToReturn);
}
