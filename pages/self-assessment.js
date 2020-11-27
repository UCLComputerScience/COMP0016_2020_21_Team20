import { useState } from 'react';

import { LikertScaleQuestion, AlertDialog, WordsQuestion } from '../components';

import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
  FormLabel,
} from '@material-ui/core';

//import { Icon } from '@material-ui/icons';
//import SaveIcon from '@material-ui/icons/SaveIcon';

import styles from './self-assessment.module.css';

const likertScaleQuestions = [
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

const wordsQuestions = [
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
];

function selfAssessment() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogActions, setDialogActions] = useState([]);

  const handleSubmit = () => {
    const answeredQuestions = likertScaleQuestions.filter(
      q => typeof q.score !== 'undefined'
    ).length;

    if (answeredQuestions !== likertScaleQuestions.length) {
      setDialogTitle('Error');
      setDialogText('Please ensure you have answered all questions');
      setDialogActions([
        <Button key="alertdialog-confirm" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
      ]);
    } else {
      setDialogTitle('Are you sure you want to submit?');
      setDialogText('Your answer will not be able to be changed.');
      setDialogActions([
        <Button key="alertdialog-edit" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
        <Button key="alertdialog-confirm" href="/self-assessment">
          Confirm submission
        </Button>,
      ]);
    }

    console.log(likertScaleQuestions, wordsQuestions);
    setShowDialog(true);
  };

  return (
    <div>
      <h1>Your Self Assessement</h1>
      <h3>
        To what extent do you agree with the following statements regarding your
        experience in the last week?
      </h3>

      <AlertDialog
        open={showDialog}
        title={dialogTitle}
        text={dialogText}
        actions={dialogActions}
      />

      {/* TODO make the mentoring thing prettier */}
      <div className={styles.mentoringSessionContainer}>
        <FormControl
          component="fieldset"
          className={styles.mentoringSessionRow}>
          <label>This submission is part of a mentoring session:</label>
          <RadioGroup
            aria-label="mentoring-session"
            name="mentoring-session"
            row>
            <FormControlLabel
              value="1"
              control={<Radio color="primary" />}
              label="Yes"
            />
            <FormControlLabel
              value="0"
              control={<Radio color="primary" />}
              label="No"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className={styles.selfAssessmentContainer}>
        {likertScaleQuestions.map((question, i) => (
          <LikertScaleQuestion
            key={i}
            question={question.question}
            questionId={question.questionId}
            questionNumber={i + 1}
            questionUrl={question.url}
            onChange={score => (question.score = score)}
          />
        ))}

        {wordsQuestions.map((question, i) => (
          <WordsQuestion
            key={i}
            question={question.question}
            questionId={question.questionId}
            questionNumber={i + 8}
            onChange={words => (question.words = words)}
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
