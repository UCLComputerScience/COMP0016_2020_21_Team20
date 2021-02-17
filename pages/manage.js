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

/**
 * If there is a valid session it displays the correct manage page for the relevant user type, else it displays the login message compnonent
 *
 * @param session The session of the users webpage, passed into other components to decided what to display
 * @param host The host name of the website
 * @param toggleTheme This is passed into the header component to control the theme being displayed
 */
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
