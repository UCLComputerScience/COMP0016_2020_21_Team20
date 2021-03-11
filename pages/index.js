import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';
import styles from './index.module.css';

const errors = {
  configuration: {
    heading: 'Server error',
    message: (
      <div>
        <p>There is a problem with the server configuration.</p>
        <p>Check the server logs for more information.</p>
      </div>
    ),
  },
  accessdenied: {
    heading: 'Access Denied',
    message: (
      <div>
        <p>You do not have permission to sign in.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  verification: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>The sign in link is no longer valid.</p>
        <p>It may have be used already or it may have expired.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  departmentdeleted: {
    heading: 'Department deleted',
    message: (
      <div>
        <p>Your department was deleted by your hospital.</p>
        <p>
          Please log in again, and request a new join URL to join another
          department.
        </p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
  invaliduser: {
    heading: 'Unable to sign in',
    message: (
      <div>
        <p>There was an error logging in. Please try again.</p>
        <p>
          <Button
            appearance="primary"
            onClick={() => signIn('keycloak', { callbackUrl: '/' })}>
            Sign in
          </Button>
        </p>
      </div>
    ),
  },
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * This page is the home/landing page of the platform.
 * If there are no errors, then the header is displayed along with a welcome message
 * and a features list to show he user what the platform allows you to achieve.
 *
 * If the user is not logged in, an additional login/register button and a "Get Started" message are shown.
 *
 * @param session the user's session object to decide what to display
 * @param toggleTheme the global function to toggle the current theme
 */
export default function Home({ session, toggleTheme }) {
  const router = useRouter();
  const featuresRef = useRef(null);

  const showError = error => {
    // Don't do exact match
    error = error.toLowerCase();
    const key = Object.keys(errors).find(e => error.indexOf(e) > -1);

    if (key) {
      const details = errors[key];
      return (
        <Message
          type="error"
          closable
          title={details.heading}
          description={details.message}
        />
      );
    }

    console.error('Unknown error');
    return null;
  };

  return (
    <div>
      <Head>
        <title>Care Quality Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} toggleTheme={toggleTheme} />

      <div className={styles.squares}>
        <div className={styles.container}>
          {router.query && router.query.error && showError(router.query.error)}
          <main className={styles.mainContent}>
            <h1 className={styles.title}>Welcome to Care Quality Dashboard</h1>
            {!session && (
              <div className={styles.loginButton}>
                <h2>Get started</h2>
                <p
                  style={{ width: '60%', margin: 'auto', marginBottom: '5px' }}>
                  If this is your first time using the Care Quality Dashboard,
                  please contact your department or hospital manager to obtain a
                  unique Join URL. This will automatically link your account to
                  your corresponding department or hospital, so you can start
                  completing self-reports and viewing your statistics.
                </p>
                <Button
                  id="loginOrRegister"
                  appearance="primary"
                  onClick={() => signIn('keycloak')}>
                  Login or Register
                </Button>
              </div>
            )}

            {session && <div className={styles.spacing}></div>}

            <div className={styles.features} ref={featuresRef}>
              <div className={styles.feature}>
                <img
                  src="/images/icons8-todo-list-96.png"
                  width={96}
                  height={96}
                />

                <p>
                  Complete your self-reporting on the device of your choice in a
                  matter of minutes. The self-reporting page is clear and simple
                  to use allowing you to efficiently report your recent
                  experience. Remember to submit as your answers aren't
                  automatically saved.
                </p>
              </div>

              <div className={styles.feature}>
                <img
                  src="/images/icons8-combo-chart-96.png"
                  width={96}
                  height={96}
                />
                <p>
                  Track your self-reporting any time and on any device. The
                  statistics page gives you great flexibilty allowing you to
                  change data ranges and whether the submissions were a part of
                  a mentoring session. There is also a quick to read summary at
                  the top which gives you great insight of your average.
                </p>
              </div>

              <div className={styles.feature}>
                <img
                  src="/images/icons8-people-96.png"
                  width={96}
                  height={96}
                />
                <p>
                  Complete your self-reporting by yourself or as part of a
                  mentoring session. You and your managers can then use these
                  useful meaningful insights to spark conversaions on how you
                  and your department can improve and what areas are doing well
                  and need to be maintained.
                </p>
              </div>
            </div>
          </main>
        </div>

        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
        <div className={styles.cube}></div>
      </div>

      <div className={styles.iconInfo}>
        <a href="https://icons8.com">Icons by Icons8</a>
      </div>
    </div>
  );
}
