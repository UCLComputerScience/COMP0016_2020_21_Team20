import { signOut } from 'next-auth/client';
import { Dropdown, Icon } from 'rsuite';
import styles from './ProfileButton.module.css';
import PropTypes from 'prop-types';

import { LeaveDeptButton } from '../';

import config from '../../lib/config';
import { Roles } from '../../lib/constants';

function ProfileButton({ session }) {
  return (
    <Dropdown role="button" title="Your account" icon={<Icon icon="user" />}>
      {/*only show leave option if clinician or department*/}
      {session &&
        (session.user.roles.includes(Roles.USER_TYPE_CLINICIAN) ||
          session.user.roles.includes(Roles.USER_TYPE_DEPARTMENT)) && (
          <Dropdown.Item role="menuitem">
            <LeaveDeptButton />
          </Dropdown.Item>
        )}
      <Dropdown.Item role="menuitem">
        <a
          className={styles.link}
          href={config.KEYCLOAK_USER_ACCOUNT_MANAGE_URL}
          target="_blank"
          rel="noopener noreferrer">
          Account settings
        </a>
      </Dropdown.Item>
      <Dropdown.Item
        role="menuitem"
        onSelect={() => signOut({ callbackUrl: '/', redirect: true })}>
        Sign out
      </Dropdown.Item>
    </Dropdown>
  );
}

ProfileButton.propTypes = {
  /** The session of the users webpage, used determine whether to show a LeaveDeptButton */
  session: PropTypes.object,
};

export default ProfileButton;
