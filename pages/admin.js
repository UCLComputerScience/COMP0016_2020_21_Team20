import { getSession } from 'next-auth/client';
import Head from 'next/head';

import { Header, LoginMessage, QuestionsTable, NoAccess } from '../components';

import { Roles } from '../lib/constants';

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

/**
 * If there is a valid session it displays the correct admin page, else it displays the login message compnonent
 *
 * @param session The session of the users webpage, passed into other components to decided what to display
 * @param toggleTheme This is passed into the header component to control the theme being displayed
 */
function manage({ session, toggleTheme }) {
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
      {session.user.roles.includes(Roles.USER_TYPE_ADMIN) ? (
        <div>
          <h3>Manage and add new questions</h3>
          <QuestionsTable />
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

export default manage;
