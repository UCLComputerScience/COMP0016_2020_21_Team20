import { useState } from 'react';
import { useSession } from 'next-auth/client';

import {
  LikertScaleQuestion,
  AlertDialog,
  WordsQuestion,
  Header,
} from '../components';

import {
  Button,
  FormControlLabel,
  Radio,
  RadioGroup,
  FormControl,
} from '@material-ui/core';

import useSWR from '../lib/swr';

//import { Icon } from '@material-ui/icons';
//import SaveIcon from '@material-ui/icons/SaveIcon';

import styles from './self-assessment.module.css';

const useQuestions = () => {
  const { data, error } = useSWR('/api/questions', {
    // We don't want to refetch questions, as we're storing our score state in this
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    likertScaleQuestions: data ? data.likert_scale : [],
    wordsQuestions: data ? data.words : [],
    isQuestionsLoading: !error && !data,
    questionsError: error,
  };
};

function selfAssessment() {
  const [session] = useSession();

  // TODO improve loading/error UI, or use server-side rendering for this page
  const {
    likertScaleQuestions,
    wordsQuestions,
    isQuestionsLoading,
    questionsError,
  } = useQuestions();

  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogActions, setDialogActions] = useState([]);
  const [isMentoringSession, setIsMentoringSession] = useState(null);
  const [showMentoringError, setShowMentoringError] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  const submitAnswers = async () => {
    const words = [];
    wordsQuestions.map(q =>
      q.words.forEach(w => words.push({ questionId: q.questionId, word: w }))
    );
    const scores = likertScaleQuestions.map(q => ({
      standardId: q.standardId,
      score: q.score,
    }));

    const res = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_id: 1, // TODO this should probably just come from the session when we have a login system
        dept_id: 1, // TODO same as above
        is_mentoring_session: isMentoringSession,
        scores,
        words,
      }),
    });

    return await res.json();
  };

  const handleSubmit = () => {
    const unAnsweredQuestions = likertScaleQuestions.filter(
      q => typeof q.score === 'undefined'
    );

    handleMentoring();

    if (unAnsweredQuestions.length !== 0 || isMentoringSession === null) {
      setShowErrors(true);

      let dialogText = 'Please complete the following unanswered questions: ';
      const errors = [];
      if (isMentoringSession === null) errors.push('Mentoring session');
      errors.push(
        ...likertScaleQuestions
          .filter(q => typeof q.score === 'undefined')
          .map(q => `Question ${q.id}`)
      );
      dialogText += errors.join('; ');

      setDialogTitle('Please ensure you have answered all questions');
      setDialogText(dialogText);
      setDialogActions([
        <Button key="alertdialog-confirm" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
      ]);
    } else {
      setShowErrors(false);
      setDialogTitle('Are you sure you want to submit?');
      setDialogText('Your answer will not be able to be changed.');
      setDialogActions([
        <Button key="alertdialog-edit" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
        //TO DO: send submission using api
        <Button key="alertdialog-confirm" onClick={() => submitAnswers()}>
          Confirm submission
        </Button>,
      ]);
    }

    console.log(likertScaleQuestions, wordsQuestions);
    setShowDialog(true);
  };

  const handleMentoring = () => {
    if (isMentoringSession === null) {
      setShowMentoringError(true);
    } else {
      setShowMentoringError(false);
    }
  };

  if (!session) {
    return (
      <div>
        <Header />
        <h1>Your Self Assessement</h1>
        <p>Please login to perform your self-assessment</p>
      </div>
    );
  }

  return (
    <div>
      <Header />
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
          {showMentoringError && (
            <div className={styles.unAnsweredAlert}>
              *please choose an answer
            </div>
          )}
          <RadioGroup
            aria-label="mentoring-session"
            name="mentoring-session"
            row>
            <FormControlLabel
              value="1"
              control={
                <Radio
                  color="primary"
                  onChange={event => setIsMentoringSession(true)}
                />
              }
              label="Yes"
            />
            <FormControlLabel
              value="0"
              control={
                <Radio
                  color="primary"
                  onChange={event => setIsMentoringSession(false)}
                />
              }
              label="No"
            />
          </RadioGroup>
        </FormControl>
      </div>

      <div className={styles.selfAssessmentContainer}>
        {likertScaleQuestions.map((question, i) => (
          <LikertScaleQuestion
            key={i}
            question={question.body}
            questionId={question.id}
            questionNumber={i + 1}
            questionUrl={question.default_url}
            onChange={score => (question.score = score)}
            showError={showErrors && typeof question.score === 'undefined'}
          />
        ))}

        {wordsQuestions.map((question, i) => (
          <WordsQuestion
            key={i}
            question={question.body}
            questionId={question.id}
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
