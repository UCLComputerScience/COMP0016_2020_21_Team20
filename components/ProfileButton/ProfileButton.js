import { signOut, useSession } from 'next-auth/client';
import { Dropdown, Icon } from 'rsuite';

import { LeaveDeptButton } from '../';

import roles from '../../lib/roles';

function ProfileButton() {
  const [session] = useSession();
  const role = session.roles[0];

  return (
    <Dropdown title="Your account" icon={<Icon icon="user" />}>
      {/*only show leave option if clinician or department*/}
      {(role === roles.USER_TYPE_CLINICIAN ||
        role === roles.USER_TYPE_DEPARTMENT) && (
        <Dropdown.Item>
          <LeaveDeptButton />
        </Dropdown.Item>
      )}
      <Dropdown.Item>
        <div onClick={signOut}>Sign out</div>
      </Dropdown.Item>
    </Dropdown>
  );
}

export default ProfileButton;
