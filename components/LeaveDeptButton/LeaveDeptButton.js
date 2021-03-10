import { signOut } from 'next-auth/client';
import { Notification, Button, ButtonToolbar } from 'rsuite';

import styles from './LeaveDeptButton.module.css';

function LeaveDeptButton() {
  const handleLeave = async () => {
    const res = await fetch('/api/departments/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (!res.error && res.success) {
      signOut({ callbackUrl: '/', redirect: true });
    } else {
      showErrorDialog(res.message);
    }
  };

  const showDialog = () => {
    Notification.open({
      title: 'Are you sure you want to leave your department?',
      duration: 0,
      description: (
        <div>
          <p>To join a new department you will need a new unique URL.</p>
          <ButtonToolbar className={styles.buttons}>
            <Button onClick={() => Notification.close()}>Cancel</Button>
            <Button
              id="leave"
              color="red"
              onClick={() => {
                Notification.close();
                handleLeave();
              }}>
              Leave
            </Button>
          </ButtonToolbar>
        </div>
      ),
    });
  };

  const showErrorDialog = message => {
    Notification.open({
      title: 'Error',
      duration: 0,
      description: (
        <div>
          <p>
            {message
              ? `Error: ${message}.`
              : `Error: leaving department failed. Please try again later or contact system administrator.`}
          </p>
          <ButtonToolbar className={styles.buttons}>
            <Button onClick={() => Notification.close()}>Continue</Button>
          </ButtonToolbar>
        </div>
      ),
    });
  };

  return <div onClick={() => showDialog()}>Leave Department</div>;
}

export default LeaveDeptButton;
