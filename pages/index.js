import { useRouter } from 'next/router';
import Head from 'next/head';
import { useRef } from 'react';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn, getSession } from 'next-auth/client';

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
 * This page is the home/landing page of the platform. If there are no errors, then the header is displayed along with a welcome message
 * and a features list to show he user what the platform allows you to achieve. Lastly if the user is not logged in then there is a
 * login/register button along with a "Get Started" message.
 *
 * @param session The session of the users webpage, used determine what access they have and therefore what to display
 * @param toggleTheme This is passed into the header component to control the theme being displayed
 */
export default function Home({ session, toggleTheme }) {
  const router = useRouter();
  const featuresRef = useRef(null);

  /**
   * Displays error as a message
   *
   * @param error error code
   */
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
      <div className="hero">
        <div className="container">
          {router.query && router.query.error && showError(router.query.error)}
          <main>
            <h1 className="title">Welcome to Care Quality Dashboard</h1>
            {!session && (
              <div className="loginButton">
                <h2>Get started</h2>
                <p
                  style={{ width: '60%', margin: 'auto', marginBottom: '5px' }}>
                  If this is your first time using the Care Quality Dashboard,
                  please contact your department or hospital manager to obtain a
                  unique Join URL. This will automatically link your account to
                  your corresponding department or hospital, so you can start
                  completing self-reports and viewing your statistics.
                </p>
                <Button appearance="primary" onClick={() => signIn('keycloak')}>
                  Login or Register
                </Button>
              </div>
            )}
            {session && <div className="spacing"></div>}
            <div className="features" ref={featuresRef}>
              <div className="feature">
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
              <div className="feature">
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
              <div className="feature">
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
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
        <div className="cube"></div>
      </div>
      <div className="iconInfo">
        <a href="https://icons8.com">Icons by Icons8</a>
      </div>

      <style jsx>{`
        .hero {
          position: relative;
          overflow: hidden;
          min-height: 87vh;
        }

        .hero__title {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          font-size: 50px;
          z-index: 1;
        }

        .cube {
          position: absolute;
          top: 80vh;
          left: 45vw;
          width: 10px;
          height: 10px;
          border: solid 1px #003298;
          transform-origin: top left;
          transform: scale(0) rotate(0deg) translate(-50%, -50%);
          animation: cube 16s ease-in forwards infinite;
        }

          .cube:nth-child(2n) {
            border-color: lighten(#0040C1, 10%);
          }

          .cube:nth-child(2) {
            animation-delay: 2s;
            left: 25vw;
            top: 40vh;
          }

          .cube:nth-child(3) {
            animation-delay: 4s;
            left: 75vw;
            top: 50vh;
          }

          .cube:nth-child(4) {
            animation-delay: 6s;
            left: 90vw;
            top: 10vh;
          }

          .cube:nth-child(5) {
            animation-delay: 8s;
            left: 10vw;
            top: 85vh;
          }

          .cube:nth-child(6) {
            animation-delay: 10s;
            left: 50vw;
            top: 10vh;
          }


        @keyframes cube {
          from {
            transform: scale(0) rotate(0deg) translate(-50%, -50%);
            opacity: 1;
          }
          to {
            transform: scale(20) rotate(960deg) translate(-50%, -50%);
            opacity: 0;
          }
        }

        .features {
          margin: 1vh;
          margin-bottom: -4vh;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }

        .feature {
          margin: 2vh;
          text-align: center;
          width: 25vw;
        }

        .loginButton {
          margin-top: 5vh;
          margin-bottom: 5vh;
          text-align: center;
        }

        .spacing {
          margin-top: 25vh;
          text-align: center;
        }

        .iconInfo {
          text-align: left !important;
          margin-top: -2vh;
        }


        .buttonsRow {
          margin-top: 10vh;
          text-align: center;
          display: flex;
          flex-direction: row;
          justify-content: center;
        }

        .container {
          paddin;g: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        main {
          padding: 4rem 0;
          flex: 1;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
        }

        footer {
          width: 100%;
          height: 100px;
          border-top: 1px solid #eaeaea;
          display: flex;
          justify-content: center;
          align-items: center;
        }

        a {
          color: inherit;
          text-decoration: none;
        }

        .title {
          margin: 5vh;
          margin-top: -5vh;
          line-height: 1.15;
          font-size: 4rem;
        }

        .title,
        .description {
          text-align: center;
        }

        .grid {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-wrap: wrap;

          max-width: 800px;
          margin-top: 3rem;
        }

        .card {
          margin: 1rem;
          flex-basis: 45%;
          padding: 1.5rem;
          text-align: left;
          color: inherit;
          text-decoration: none;
          border: 1px solid #eaeaea;
          border-radius: 10px;
          transition: color 0.15s ease, border-color 0.15s ease;
          cursor: pointer;
        }

        .card:hover,
        .card:focus,
        .card:active {
          color: #0070f3;
          border-color: #0070f3;
        }

        .card h3 {
          margin: 0 0 1rem 0;
          font-size: 1.5rem;
        }

        .card p {
          margin: 0;
          font-size: 1.25rem;
          line-height: 1.5;
        }

        @media (max-width: 600px) {
          .grid {
            width: 100%;
            flex-direction: column;
          }
        }
      `}</style>
    </div>
  );
}
