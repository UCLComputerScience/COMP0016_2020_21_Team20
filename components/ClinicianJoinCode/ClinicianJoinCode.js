import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Icon, Alert } from 'rsuite';
import { mutate } from 'swr';

import PropTypes from 'prop-types';
import styles from './ClinicianJoinCode.module.css';

import useSWR from '../../lib/swr';
import { Roles } from '../../lib/constants';

const useCode = (id, session) => {
  if (!session) {
    return { code: null, error: true, message: 'You are not logged in' };
  }

  const { data, error } = useSWR('/api/departments/' + id);
  return data
    ? {
        code: data
          ? { name: data.name, code: data.clinician_join_codes.code }
          : data,
        error: error || data.error,
        message: data.message,
      }
    : {
        code: null,
        error: error,
        message: error ? error.message : 'Unknown error',
      };
};

function ClinicianJoinCode({ session, host }) {
  const { code, error, message } = useCode(session.user.departmentId, session);
  console.log(code, error, message);
  const regenerateCode = async id => {
    const res = await fetch(
      '/api/join_codes/' + Roles.USER_TYPE_DEPARTMENT + '/' + id,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
    ).then(res => res.json());

    if (res.error) {
      Alert.error(`Error: ${res.message}`);
    } else {
      mutate('/api/departments/' + id);
      Alert.success('Join URL updated', 3000);
    }
  };

  if (error) {
    Alert.error(
      `Error: ${message}. Please reload/try again later or the contact system administrator`,
      0
    );

    return (
      <div className={styles.content}>
        There was an error fetching your department&apos;s unique Join URL
      </div>
    );
  }

  if (!code) {
    return (
      <div className={styles.content}>
        Loading your department&apos;s unique Join URL...
      </div>
    );
  }

  const joinUrl = `https://${host}/join/${Roles.USER_TYPE_CLINICIAN}/${code.code}`;
  return (
    <div className={styles.content}>
      <div className={styles.url}>
        {`Please send this unique URL to clinicians so they can join your ${code.name} department:
        ${joinUrl}`}
      </div>

      <div className={styles.actions}>
        <CopyToClipboard text={joinUrl}>
          <Button
            appearance="primary"
            onClick={() => Alert.info('Copied', 5000)}>
            <Icon icon="clone" /> Copy to clipboard
          </Button>
        </CopyToClipboard>

        <Button
          appearance="primary"
          onClick={() => regenerateCode(session.user.departmentId)}>
          Re-generate URL
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
