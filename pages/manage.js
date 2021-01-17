import { useSession } from 'next-auth/client';
import Head from 'next/head';

import {
  UrlsTable,
  Header,
  LoginMessage,
  QuestionsTable,
  DepartmentsTable,
  NoAccess,
} from '../components';

import Roles from '../lib/constants';

function manage() {
  const [session, loading] = useSession(); // TODO use loading state better?
  if (!session) {
    return (
      <div>
        <Header />
        <LoginMessage />
      </div>
    );
  }
  const role = session.roles[0]; // TODO do we want to support multiple roles?

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <Header />
      </div>
      {role === Roles.USER_TYPE_DEPARTMENT ? (
        <div>
          <h3>Manage the URLs of each question</h3>
          <UrlsTable />
        </div>
      ) : role === Roles.USER_TYPE_ADMIN ? (
        <div>
          <h3>Manage and add new questions</h3>
          <QuestionsTable />
        </div>
      ) : role === Roles.USER_TYPE_HOSPITAL ? (
        <div>
          <h3>Manage and add new departments</h3>
          <DepartmentsTable />
        </div>
      ) : (
        <NoAccess />
      )}
    </div>
  );
}

export default manage;
