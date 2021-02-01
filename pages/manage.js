import { getSession } from 'next-auth/client';
import Head from 'next/head';

import {
  UrlsTable,
  Header,
  LoginMessage,
  QuestionsTable,
  DepartmentsTable,
  NoAccess,
} from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return {
    props: {
      session: await getSession(context),
      host: context.req.headers.host,
    },
  };
}

function manage({ session, host, toggleTheme }) {
  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <Header session={session} toggleTheme={toggleTheme} />
      </div>
      {session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT) ? (
        <div>
          <h3>Manage the URLs of each question</h3>
          <UrlsTable session={session} host={host} />
        </div>
      ) : session.user.roles.includes(Roles.USER_TYPE_ADMIN) ? (
        <div>
          <h3>Manage and add new questions</h3>
          <QuestionsTable />
        </div>
      ) : session.user.roles.includes(Roles.USER_TYPE_HOSPITAL) ? (
        <div>
          <h3>Manage and add new departments</h3>
          <DepartmentsTable host={host} />
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

export default manage;
