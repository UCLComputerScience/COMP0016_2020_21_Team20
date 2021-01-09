import { useEffect, useState } from 'react';
import { signOut } from 'next-auth/client';

import { Button } from 'rsuite';

import { AlertDialog } from '../';

function LeaveDeptButton() {
  const [showDialog, setShowDialog] = useState(false);
  const [showErrorDialog, setShowErrorDialog] = useState(false);

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
      setShowDialog(false);
      setShowErrorDialog(true);
    }
  };

  // TODO this dialog opening logic is broken for some reason?? it just doesn't open!
  return (
    <div>
      <AlertDialog
        open={showDialog}
        setOpen={setShowDialog}
        title="Are you sure you want to leave your department?"
        text="To re-join/join a new department you will need a unique URL."
        actions={[
          <Button
            key="alertdialog-cancel"
            color="secondary"
            onClick={() => setShowDialog(false)}>
            Cancel
          </Button>,
          <Button key="alertdialog-leave" onClick={() => handleLeave()}>
            Leave
          </Button>,
        ]}
      />
      <AlertDialog
        open={showErrorDialog}
        setOpen={setShowErrorDialog}
        title="Error"
        text="Leaving department failed, please try again or contact system administrator."
        actions={[
          <Button
            key="alertdialog-continue"
            color="secondary"
            onClick={() => setShowErrorDialog(false)}>
            Continue
          </Button>,
        ]}
      />
      <div onClick={() => setShowDialog(true)}>Leave Department</div>
    </div>
  );
}

export default LeaveDeptButton;
