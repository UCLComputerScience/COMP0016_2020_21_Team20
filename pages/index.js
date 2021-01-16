import { useRouter } from 'next/router';
import Link from 'next/link';
import Head from 'next/head';

import { Header } from '../components';
import { Button, Message } from 'rsuite';
import { signIn } from 'next-auth/client';

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
};

export default function Home() {
  const router = useRouter();

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
    <div className="container">
      <Head>
        <title>Care Quality Dashboard</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header />

      {router.query && router.query.error && showError(router.query.error)}
      <main>
        <h1 className="title">Welcome to Care Quality Dashboard</h1>
        <p>
          This is a demo of the current state of development for the Care
          Quality Dashboard.
          <br />
          Please expect things to break and bear with us whilst we implement all
          the features!
          <br />
          However, if you spot something that doesn't look right please do let
          us know (via Trello or Whatsapp) and we'll get it fixed!
        </p>

        <div className="grid">
          <div className="card">
            <Link href="/self-assessment">
              <div>
                <h3>Self assessment &rarr;</h3>
                <p>Do your self assessment!</p>
              </div>
            </Link>
          </div>
          <div className="card">
            <Link href="/statistics">
              <div>
                <h3>Statistics &rarr;</h3>
                <p>
                  Consult your personal statistics for the different Health and
                  Care Standards
                </p>
              </div>
            </Link>
          </div>
        </div>
      </main>

      <footer>
        <h3>Systems Engineering Team 20</h3>
      </footer>

      <style jsx>{`
        .container {
          min-height: 100vh;
          paddin;g: 0 0.5rem;
          display: flex;
          flex-direction: column;
          justify-content: center;
        }

        main {
          padding: 5rem 0;
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
          margin: 0;
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
