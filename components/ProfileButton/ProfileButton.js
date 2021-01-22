import { signOut } from 'next-auth/client';
import { Dropdown, Icon } from 'rsuite';
import styles from './ProfileButton.module.css';

import { LeaveDeptButton } from '../';

import config from '../../lib/config';
import { Roles } from '../../lib/constants';

function ProfileButton({ session }) {
  const role = session.roles[0];

  return (
    <Dropdown title="Your account" icon={<Icon icon="user" />}>
      {/*only show leave option if clinician or department*/}
      {(role === Roles.USER_TYPE_CLINICIAN ||
        role === Roles.USER_TYPE_DEPARTMENT) && (
        <Dropdown.Item>
          <LeaveDeptButton />
        </Dropdown.Item>
      )}
      <Dropdown.Item>
        <a
          className={styles.link}
          href={config.KEYCLOAK_USER_ACCOUNT_MANAGE_URL}
          target="_blank"
          rel="noopener">
          Account settings
        </a>
      </Dropdown.Item>
      <Dropdown.Item onSelect={signOut}>Sign out</Dropdown.Item>
    </Dropdown>
  );
}

export default ProfileButton;
