import { Question } from '../components';
import { useState } from 'react';

import { Button } from '@material-ui/core';
//import { Icon } from '@material-ui/icons';
//import SaveIcon from '@material-ui/icons/SaveIcon';

import styles from './self-assessment.module.css';

const questions = [
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    questionId: 1,
    url: 'https://example.com',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    questionId: 2,
    url: 'https://example.com',
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    questionId: 3,
    url: 'https://example.com',
  },
  {
    question:
      'I have listened and responded with empathy to the patient’s concerns.',
    questionId: 4,
    url: 'https://example.com',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    questionId: 5,
    url: 'https://example.com',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    questionId: 6,
    url: 'https://example.com',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    questionId: 7,
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
