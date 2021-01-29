import { useState } from 'react';
import { Button, Input, Alert } from 'rsuite';
import { mutate } from 'swr';

import styles from './DepartmentsTable.module.css';

import { AlertDialog, CustomTable } from '../';
import { Roles } from '../../lib/constants';
import useSWR from '../../lib/swr';

const columns = [
  {
    id: 'department',
    label: 'Department Name',
    width: 'auto',
    render: (editing, row) => row['name'],
  },
  {
    id: 'url',
    label: 'Join URL',
    width: 'auto',
    render: (editing, row, host) =>
      `https://${host}/join/${Roles.USER_TYPE_DEPARTMENT}/${row['department_join_code']}`,
  },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/departments', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (data) {
    return {data: data, error: error || data.error, message: data.message};
  }
  return {data: null, error: error , message: error ? error.message : null};
};

export default function DepartmentsTable({ host }) {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogContent, setDialogContent] = useState([]);
  const [dialogActions, setDialogActions] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogActions, setDeleteDialogActions] = useState([]);
  var newRow = { name: null };
  const { data, error, message } = useDatabaseData();
  const localData = data;
  if (error) {
    Alert.error("Error: '" + message + "'. Please reload/try again later or the contact system administrator", 0);
  }

  const regenerateInDatabase = async id => {
    const res = await fetch(
      '/api/join_codes/' + Roles.USER_TYPE_HOSPITAL + '/' + id,
      {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
      }
    );
    return await res.json();
  };

  const regenerateCode = async id => {
    await regenerateInDatabase(id);
    mutate('/api/departments');
    Alert.success('Join URL updated', 3000);
  };

  const resetNewRow = () => {
    newRow = { name: null };
  };

  const sendNewToDatabase = async () => {
    const res = await fetch('/api/departments/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name: newRow.name,
      }),
    });
    return await res.json();
  };

  const deleteInDatabase = async name => {
    const res = await fetch('/api/departments/' + name, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  };

  const deleteRow = async id => {
    await deleteInDatabase(id);
    //to ensure no stale data, so refetch
    mutate('/api/departments');
    setShowDeleteDialog(false);
    Alert.success('Department successfully deleted', 3000);
  };

  const confirmDelete = id => {
    setShowDeleteDialog(true);
    //add which department about to delete in text of dialog
    setDeleteDialogActions([
      <Button
        key="alertdialog-edit"
        color="red"
        onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>,
      <Button
        key="alertdialog-confirm"
        appearance="primary"
        onClick={() => deleteRow(id)}>
        Yes, delete
      </Button>,
    ]);
  };

  const addRow = async () => {
    if (newRow.name === null) {
      setDialogText(
        <div className={styles.alertText}>
          *Please don't leave department name blank
        </div>
      );
    } else {
      await sendNewToDatabase();
      setShowDialog(false);
      resetNewRow();
      //to ensure no stale data, so refetch
      mutate('/api/departments');
      Alert.success('New department successfully added', 3000);
    }
  };

  const setDialog = () => {
    setDialogTitle('Please fill in the new departments name:');
    setDialogContent([
      <div className={styles.alertContent}>
        <Input
          className={styles.input}
          key={'new-department-name'}
          onChange={value => (newRow.name = value)}
        />
      </div>,
    ]);
    setDialogActions([
      <Button
        key="alertdialog-edit"
        color="red"
        onClick={() => setShowDialog(false)}>
        Cancel
      </Button>,
      <Button
        key="alertdialog-confirm"
        onClick={() => addRow()}
        appearance="primary">
        Add
      </Button>,
    ]);
    setDialogText(null);
    setShowDialog(true);
  };

  const showCopyAlert = () => {
    Alert.info('Copied', 3000);
  };

  return (
    <div>
      <div className={styles.intro}>
        <p className={styles.url}>
          Please send these unique URLs to department managers to join the
          respective departments
        </p>
        <Button
          className={styles.button}
          appearance="primary"
          onClick={() => setDialog()}>
          Add new department
        </Button>
      </div>

      <AlertDialog
        open={showDialog}
        setOpen={setShowDialog}
        title={dialogTitle}
        text={dialogText}
        content={dialogContent}
        actions={dialogActions}
      />
      <AlertDialog
        open={showDeleteDialog}
        setOpen={setShowDeleteDialog}
        title={'Are you sure you want to delete this deprtment?'}
        text={
          'Deleting a department cannot be undone and all of the departments data will be deleted.'
        }
        actions={deleteDialogActions}
      />
      {!error && <CustomTable
        tableType="departments"
        host={host}
        data={localData}
        columns={columns}
        editing={false} //cannot edit departments
        showCopyAlert={() => showCopyAlert()}
        regenerateCode={id => regenerateCode(id)}
        confirmDelete={id => confirmDelete(id)}
        />}
    </div>
  );
}
