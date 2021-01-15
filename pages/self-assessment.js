import { useState } from 'react';
import { useSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import { Button, IconButton, Icon, Toggle, Alert } from 'rsuite';
import Head from 'next/head';

import styles from './self-assessment.module.css';

import {
  LikertScaleQuestion,
  AlertDialog,
  WordsQuestion,
  Header,
  LoginMessage,
} from '../components';

import useSWR from '../lib/swr';

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
  const router = useRouter();

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
    wordsQuestions.forEach(q =>
      q.words.forEach(w => words.push({ questionId: q.id, word: w }))
    );
    const scores = likertScaleQuestions.map(q => ({
      standardId: q.standards.id,
      score: q.score,
    }));

    const status = await fetch('/api/responses', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        is_mentoring_session: isMentoringSession === true,
        scores,
        words,
      }),
    }).then(res => res.status);

    if (status === 200) {
      Alert.success('Successfully submitted', 3000);
      router.push('/statistics');
    } else {
      // TODO handle error
    }
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
        <Button key="alertdialog-confirm" onClick={() => submitAnswers()}>
          Confirm submission
        </Button>,
      ]);
    }

    setShowDialog(true);
  };

  // TODO improve error handling styling
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
        <LoginMessage />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Self-assessment</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />
      <AlertDialog
        open={showDialog}
        setOpen={setShowDialog}
        title={dialogTitle}
        text={dialogText}
        actions={dialogActions}
      />

      <div className={styles.mentoringSessionContainer}>
        <label htmlFor="mentoring-session">
          Is this submission as part of a mentoring session?
          {showMentoringError && ` (please choose an answer)`}
        </label>
        <Toggle
          className={styles.mentoringToggle}
          size="lg"
          checkedChildren="Yes"
          unCheckedChildren="No"
          onChange={value => setIsMentoringSession(value)}
        />
      </div>

      <div className={styles.selfAssessmentContainer}>
        <p className={styles.mainQuestion}>
          To what extent do you agree with the following statements regarding
          your recent experience?
        </p>

        {likertScaleQuestions.map((question, i) => (
          <LikertScaleQuestion
            key={i}
            question={question.body}
            questionId={question.id}
            questionNumber={i + 1}
            questionUrl={question.url}
            onChange={score => (question.score = score)}
            showError={showErrors && typeof question.score === 'undefined'}
          />
        ))}

        {wordsQuestions.map((question, i) => (
          <WordsQuestion
            key={i}
            question={question.body}
            questionId={question.id}
            questionNumber={i + likertScaleQuestions.length + 1}
            onChange={words => (question.words = words)}
          />
        ))}

        <IconButton
          className={styles.submit}
          appearance="primary"
          onClick={() => handleSubmit()}
          placement="right"
          icon={<Icon icon="send" />}>
          Submit
        </IconButton>
      </div>
    </div>
  );
}

export default selfAssessment;
