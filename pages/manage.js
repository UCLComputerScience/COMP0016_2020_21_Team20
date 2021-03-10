import { getSession } from 'next-auth/client';
import Head from 'next/head';
import { useState } from 'react';
import { Alert, Button, ButtonGroup, Modal } from 'rsuite';

import {
  UrlsTable,
  Header,
  LoginMessage,
  NewUserForm,
  DepartmentsTable,
  NoAccess,
  NewEntityForm,
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
  const [addNewUserModalUserType, setAddNewUserModalUserType] = useState(null);
  const [addNewEntityModalType, setAddNewEntityModalType] = useState(null);

  if (!session) {
    return (
      <div>
        <Header session={session} toggleTheme={toggleTheme} />
        <LoginMessage />
      </div>
    );
  }

  const renderContent = () => {
    if (session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) {
      return (
        <div>
          <h3>Manage the URLs of each question</h3>
          <UrlsTable session={session} host={host} />
        </div>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_ADMIN)) {
      return (
        <div>
          <h3>Manage users, health boards and hospitals</h3>
          <p>
            Please use the following options to add a new health board or
            hospital to the system.
          </p>
          <p>
            You may also setup user accounts for new health board or hospital
            users, or platform administrators, to generate credentials that can
            be distributed to relevant staff.
          </p>
          <p>
            For more advanced user management (such as updating passwords or
            deleting users), please visit the platform&apos;s Keycloak Admin
            Console for precise user management functionality.
          </p>
          <p>
            <strong>
              No users should be added to this system unless you have
              authorisation from your Information Governance Team and you have
              read your organisation&apos;s Privacy Policy.
            </strong>
          </p>

          <Modal
            show={addNewUserModalUserType !== null}
            onHide={() => setAddNewUserModalUserType(null)}
            size="xs">
            <Modal.Header>
              <Modal.Title>Add new user</Modal.Title>
              <Modal.Header>
                Please enter the details of the new user
              </Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <NewUserForm
                userType={addNewUserModalUserType}
                onSuccess={() => {
                  Alert.success(
                    'User successfully added! Please share the password with the user -- they will be required to update this when they login',
                    10000
                  );
                  setAddNewUserModalUserType(null);
                }}
                onError={message => Alert.error('Error: ' + message, 0)}
              />
            </Modal.Body>
          </Modal>

          <Modal
            show={addNewEntityModalType !== null}
            onHide={() => setAddNewEntityModalType(null)}
            size="xs">
            <Modal.Header>
              <Modal.Title>Add new {addNewEntityModalType}</Modal.Title>
              <Modal.Header>
                Please enter the details of the new {addNewEntityModalType}
              </Modal.Header>
            </Modal.Header>
            <Modal.Body>
              <NewEntityForm
                hospital={addNewEntityModalType === 'hospital'}
                healthBoard={addNewEntityModalType === 'health board'}
                onSuccess={() => {
                  Alert.success('Hospital successfully added!');
                  setAddNewEntityModalType(null);
                }}
                onError={message => Alert.error('Error: ' + message, 0)}
              />
            </Modal.Body>
          </Modal>

          <p>
            <ButtonGroup justified>
              <Button
                appearance="ghost"
                onClick={() => setAddNewEntityModalType('health board')}>
                Add new health board
              </Button>
              <Button
                appearance="ghost"
                onClick={() => setAddNewEntityModalType('hospital')}>
                Add new hospital
              </Button>
            </ButtonGroup>
          </p>

          <p>
            <ButtonGroup justified>
              <Button
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_HEALTH_BOARD)
                }>
                Add new health board user
              </Button>
              <Button
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_HOSPITAL)
                }>
                Add new hospital user
              </Button>
            </ButtonGroup>
          </p>

          <p>
            <ButtonGroup justified>
              <Button
                appearance="ghost"
                onClick={() =>
                  setAddNewUserModalUserType(Roles.USER_TYPE_ADMIN)
                }>
                Add new platform administrator
              </Button>
            </ButtonGroup>
          </p>
        </div>
      );
    } else if (session.user.roles.includes(Roles.USER_TYPE_HOSPITAL)) {
      return (
        <div>
          <h3>Manage and add new departments</h3>
          <DepartmentsTable host={host} />
        </div>
      );
    } else {
      return <NoAccess />;
    }
  };

  return (
    <div>
      <Head>
        <title>Manage</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div style={{ zIndex: 1000, position: 'relative' }}>
        <Header session={session} toggleTheme={toggleTheme} />
      </div>
      {renderContent()}
    </div>
  );
}

export default manage;
