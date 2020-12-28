import { UrlTable, Header, QuestionsTable } from '../components';

import { signIn, useSession } from 'next-auth/client';

import roles from '../lib/roles';
import styles from './manage.module.css';

function manage() {
  const [session, loading] = useSession(); // TODO use loading state better?
  if (!session) {
    return (
      <div>
        <Header />
        <p>Please login</p>
      </div>
    );
  }
  const role = session.roles[0]; // TODO do we want to support multiple roles?

  return (
    <div>
      <Header />
      {role === roles.USER_TYPE_DEPARTMENT ? (
        <div>
          <h3>Manage the URL's of each question</h3>
          <UrlTable />
        </div>
      ) : role === roles.USER_TYPE_ADMIN ? (
        <div>
          <h3>Manage and add new questions (delete functionality not yet added)</h3>
          <QuestionsTable />
        </div>
      ) : (
            "You do not have access to this page"
          )}
    </div>
  );
}

export default manage;
