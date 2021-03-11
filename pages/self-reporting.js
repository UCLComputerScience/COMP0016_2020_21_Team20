import { useState } from 'react';
import { getSession } from 'next-auth/client';
import { useRouter } from 'next/router';
import Head from 'next/head';
import PropTypes from 'prop-types';
import {
  Button,
  IconButton,
  Icon,
  Toggle,
  Alert,
  Loader,
  Message,
} from 'rsuite';

import styles from './self-reporting.module.css';

import {
  LikertScaleQuestion,
  AlertDialog,
  WordsQuestion,
  Header,
  LoginMessage,
  NoAccess,
} from '../components';

import useSWR from '../lib/swr';
import { Roles } from '../lib/constants';

/**
 * Fetches questions from the backend
 */
const useQuestions = () => {
  const { data, error } = useSWR('/api/questions', {
    // We don't want to refetch questions, as we're storing our score state in this
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return {
    likertScaleQuestions: data && data.likert_scale ? data.likert_scale : [],
    wordsQuestions: data && data.words ? data.words : [],
    isQuestionsLoading: !error && !data,
    questionsError: data ? data.error : error,
  };
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * The self-reporting page provides the self-report form to be completed.
 * If the user is not logged in, they are prompted to login.
 *
 * It is only accessible to clinicians and department managers. All other users do not have
 * access to this page.
 *
 * This page uses the /api/recent_words, /api/questions API endpoints to fetch the relevant data.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */
function SelfReporting({ session, toggleTheme }) {
  const router = useRouter();
  const { data: words } = useSWR('/api/recent_words');

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
  const [isMentoringSession, setIsMentoringSession] = useState(false);
  const [showErrors, setShowErrors] = useState(false);

  /**
   * Sends the answers to the backend.
   * If successful it redirects the user to the statistics page
   * On error, an alert is displayed
   */
  const submitAnswers = async () => {
    const words = [];
    wordsQuestions.forEach(
      q =>
        q.words &&
        q.words.forEach(w => w && words.push({ questionId: q.id, word: w }))
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
      Alert.error(
        'There was an error submitting your responses. Please try again or contact the system administrator if the issue persists',
        0
      );
    }
  };

  /**
   * Checks if any of the required questions have been left blank and then shows a corresponding pop-up.
   * If all required questions are completed, the pop-up allows the user to edit or submit.
   * Else the the pop-up prompts which questions are remaining and lets them edit their responses.
   */
  const handleSubmit = () => {
    const unAnsweredQuestions = likertScaleQuestions.filter(
      q => typeof q.score === 'undefined'
    );

    if (unAnsweredQuestions.length !== 0 || isMentoringSession === null) {
      setShowErrors(true);

      let dialogText = 'Please complete the following unanswered questions: ';
      const errors = [];
      if (isMentoringSession === null) errors.push('Mentoring session');
      errors.push(
        ...likertScaleQuestions
          .filter(q => typeof q.score === 'undefined')
          .map(q => `Question ${likertScaleQuestions.indexOf(q) + 1}`)
      );
      dialogText += errors.join('; ');

      setDialogTitle(
        <text id="incomplete">
          Please ensure you have answered all questions
        </text>
      );
      setDialogText(dialogText);
      setDialogActions([
        <Button key="alertdialog-confirm" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
      ]);
    } else {
      setShowErrors(false);
      setDialogTitle(
        'Are you sure you want to submit? (Your answer will not be able to be changed)'
      );
      setDialogText(
        'Please ensure that you have marked this self-report as a mentoring session if applicable before submitting.'
      );
      setDialogActions([
        <Button key="alertdialog-edit" onClick={() => setShowDialog(false)}>
          Edit my responses
        </Button>,
        <Button
          id="confirm"
          key="alertdialog-confirm"
          onClick={() => submitAnswers()}>
          Confirm submission
        </Button>,
      ]);
    }

    setShowDialog(true);
  };

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  if (
    !session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) &&
    !session.user.roles.includes(Roles.USER_TYPE_CLINICIAN)
  ) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <NoAccess />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Self-reporting</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />
      <AlertDialog
        open={showDialog}
        setOpen={setShowDialog}
        title={dialogTitle}
        text={dialogText}
        actions={dialogActions}
      />

      {!questionsError && !isQuestionsLoading && (
        <div className={styles.mentoringSessionContainer}>
          <label htmlFor="mentoring-session">
            Is this submission as part of a mentoring session?
          </label>
          <Toggle
            className={styles.mentoringToggle}
            size="lg"
            checkedChildren="Yes"
            unCheckedChildren="No"
            onChange={value => setIsMentoringSession(value)}
          />
        </div>
      )}

      <div className={styles.selfReportingContainer}>
        {isQuestionsLoading && (
          <Loader
            className={styles.loading}
            size="lg"
            content="Loading questions..."
          />
        )}

        {questionsError && (
          <Message
            type="error"
            title="Error fetching questions"
            description={
              <p>
                There was an error fetching the questions. Please try again
                later or contact the system administrator if the issue persists.
              </p>
            }
          />
        )}

        {!questionsError && !isQuestionsLoading && (
          <p className={styles.mainQuestion}>
            To what extent do you agree with the following statements regarding
            your recent experience?
          </p>
        )}

        {!questionsError &&
          !isQuestionsLoading &&
          likertScaleQuestions.map((question, i) => (
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

        {!questionsError &&
          !isQuestionsLoading &&
          wordsQuestions.map((question, i) => (
            <WordsQuestion
              key={i}
              suggestedWords={words ? words.words : []}
              question={question.body}
              questionId={question.id}
              questionNumber={i + likertScaleQuestions.length + 1}
              onChange={words => (question.words = words)}
            />
          ))}

        {!questionsError && !isQuestionsLoading && (
          <IconButton
            id="submit"
            className={styles.submit}
            appearance="primary"
            onClick={() => handleSubmit()}
            placement="right"
            icon={<Icon icon="send" />}
            block>
            Submit
          </IconButton>
        )}
      </div>
    </div>
  );
}

SelfReporting.propTypes = {
  session: PropTypes.object.isRequired,
  toggleTheme: PropTypes.func.isRequired,
};

export default SelfReporting;
