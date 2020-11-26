import { Question } from '../components';
import { useState } from 'react';

import { Button } from '@material-ui/core';
//import { Icon } from '@material-ui/icons';
//import SaveIcon from '@material-ui/icons/SaveIcon';

import styles from './self-assessment.module.css';

const questions = [
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case',
    questionId: 1,
    url: 'https://example.com',
  },
  {
    question:
      'I have listened to and understood the patient’s knowledge and concerns about their presentation.',
    questionId: 2,
    url: 'https://example.com',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    questionId: 3,
    url: 'https://example.com',
  },
];

function selfAssessment() {
  return (
    <div>
      <h1>Your Self Assessement</h1>
      <h3>
        To what extent do you agree with the following statements regarding your
        experience in the last week?
      </h3>
      <div className={styles.selfAssessmentContainer}>
        {questions.map((question, i) => (
          <Question
            key={i}
            question={question.question}
            questionId={question.questionId}
            questionNumber={i + 1}
            questionUrl={question.url}
            onChange={score => (question.score = score)}
          />
        ))}

        <Button
          variant="contained"
          color="primary"
          className={styles.submit}
          onClick={() => handleSubmit()}
          // startIcon={<SaveIcon />}
        >
          Submit
        </Button>
      </div>
    </div>
  );
}

export default selfAssessment;
