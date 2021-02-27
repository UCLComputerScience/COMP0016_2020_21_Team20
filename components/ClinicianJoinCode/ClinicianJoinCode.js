import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Icon, Alert } from 'rsuite';
import { mutate } from 'swr';

import PropTypes from 'prop-types';
import styles from './ClinicianJoinCode.module.css';

import useSWR from '../../lib/swr';
import { Roles } from '../../lib/constants';

const getCode = id => {
  const { data, error } = useSWR('/api/departments/' + id, {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

function ClinicianJoinCode({ session, host }) {
  const { data, error, message } = session
    ? getCode(session.user.departmentId)
    : { data: null, error: null, message: null };
  const code = data;
  if (error) {
    Alert.error(
      "Error: '" +
        message +
        "'. Please reload/try again later or the contact system administrator",
      0
    );
  }

  const regenerateInDatabase = async id => {
    const res = await fetch(
      '/api/join_codes/' + Roles.USER_TYPE_DEPARTMENT + '/' + id,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return await res.json();
  };

  const regenerateCode = async id => {
    await regenerateInDatabase(id);
    mutate('/api/departments/' + id);
    Alert.success('Join URL updated', 3000);
  };

  const showCopyAlert = () => {
    Alert.info('Copied', 3000);
  };

  return (
    <div className={styles.content}>
      <div className={styles.url}>
        {'Please send this unique URL to clinicians so they can join your ' +
          (!error ? (code ? code['name'] : 'loading...') : 'error') +
          ' department:'}{' '}
        {`https://${host}/join/${Roles.USER_TYPE_CLINICIAN}/${
          !error
            ? code
              ? code['clinician_join_codes']['code']
              : 'loading...'
            : 'error'
        }`}
      </div>
      <div className={styles.actions}>
        <CopyToClipboard
          text={`https://${host}/join/${Roles.USER_TYPE_CLINICIAN}/${
            !error
              ? code
                ? code['clinician_join_codes']['code']
                : 'loading...'
              : 'error'
          }`}>
          <Button appearance="primary" onClick={() => showCopyAlert()}>
            <Icon icon="clone" /> Copy to clipboard
          </Button>
        </CopyToClipboard>

        <Button
          appearance="primary"
          onClick={() => regenerateCode(session.user.departmentId)}>
          <div>Re-generate URL</div>
        </Button>
      </div>
    </div>
  );
}

ClinicianJoinCode.propTypes = {
  /** The session of the users webpage, used to fecth the correct join code from the backend*/
  session: PropTypes.object,
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
};

export default ClinicianJoinCode;
