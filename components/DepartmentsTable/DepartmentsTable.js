import { useState } from 'react';
import { CopyToClipboard } from 'react-copy-to-clipboard';
import { Button, Input, Icon, Alert } from 'rsuite';
import { mutate } from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import styles from './DepartmentsTable.module.css';

import { AlertDialog, CustomTable } from '../';
import useSWR from '../../lib/swr';
import roles from '../../lib/roles';

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
    render: (editing, row) =>
      `https://${window.location.host}/join/${roles.USER_TYPE_DEPARTMENT}/${row['department_join_code']}`,
  },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/departments', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data;
};

export default function DepartmentsTable() {
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogContent, setDialogContent] = useState([]);
  const [dialogActions, setDialogActions] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogActions, setDeleteDialogActions] = useState([]);
  var newRow = { name: null };
  let localData = useDatabaseData();

  const regenerateInDatabase = async id => {
    const res = await fetch(
      '/api/join_codes/' + roles.USER_TYPE_HOSPITAL + '/' + id,
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

  // const deleteInDatabase = async name => {
  //   //TODO
  //   const res = await fetch('/api/departments/' + name, {
  //     method: 'DELETE',
  //     headers: { 'Content-Type': 'application/json' },
  //   });
  //   return await res.json();
  // };

  const deleteRow = async name => {
    await deleteInDatabase(name);
    //to ensure no stale data, so refetch
    mutate('/api/departments');
    setShowDeleteDialog(false);
    Alert.success(name + ' department deleted', 3000);
  };

  const confirmDelete = name => {
    setShowDeleteDialog(true);
    //add which department about to delete in text of dialog
    setDeleteDialogActions([
      <Button key="alertdialog-edit" onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>,
      <Button
        key="alertdialog-confirm"
        color="red"
        onClick={() => {
          /*deleteRow(name)*/
        }}>
        Yes (deleting not supported yet)
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
      <Button key="alertdialog-edit" onClick={() => setShowDialog(false)}>
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
      <div>
        Please send these unique URLs to department managers to join the
        respective departments
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
      <Button
        className={styles.buttons}
        appearance="primary"
        onClick={() => setDialog()}>
        Add new department
      </Button>
      <CustomTable
        tableType='departments'
        data={localData}
        columns={columns}
        editing={false} //cannot edit departments
        showCopyAlert={() => showCopyAlert()}
        regenerateCode={(id) => regenerateCode(id)}
        confirmDelete={(name) => confirmDelete(name)}
        />
    </div>
  );
}
