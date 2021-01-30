import { signOut } from 'next-auth/client';
import { Notification, Button, ButtonToolbar } from 'rsuite';

import styles from './LeaveDeptButton.module.css';

function LeaveDeptButton() {
  const leaveInDatabase = async () => {
    const res = await fetch('/api/departments/leave', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  };

  const handleLeave = async () => {
    const success = await leaveInDatabase();
    if (success.success === true) {
      signOut();
    } else {
      showErrorDialog();
    }
  };

  const showDialog = () => {
    Notification.open({
      title: 'Are you sure you want to leave your department?',
      duration: 0,
      description: (
        <div>
          <p>To join a new department you will need a unique URL.</p>
          <ButtonToolbar className={styles.buttons}>
            <Button
              onClick={() => {
                Notification.close();
              }}>
              Cancel
            </Button>
            <Button
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

  const showErrorDialog = () => {
    Notification.open({
      title: 'Error',
      duration: 0,
      description: (
        <div>
          <p>
            Leaving department failed, please try again or contact system
            administrator.
          </p>
          <ButtonToolbar className={styles.buttons}>
            <Button
              onClick={() => {
                Notification.close();
              }}>
              Continue
            </Button>
          </ButtonToolbar>
        </div>
      ),
    });
  };

  return <div onClick={() => showDialog()}>Leave Department</div>;
}

export default LeaveDeptButton;
