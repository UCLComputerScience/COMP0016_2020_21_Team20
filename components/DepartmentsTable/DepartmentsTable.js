import { useState } from 'react';

import { CopyToClipboard } from 'react-copy-to-clipboard';

import { Input, Icon, Button, Table } from 'rsuite';

import { AlertDialog } from '..';
import styles from './DepartmentsTable.module.css';
import useSWR from '../../lib/swr';
import { mutate } from 'swr';
import roles from '../../lib/roles';

const columns = [
  { id: 'department', label: 'Department Name', flexGrow: 1 },
  { id: 'joinUrl', label: 'Join URL', flexGrow: 2 },
];

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/departments', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data
    ? data.map(d => ({
        department: d.name,
        joinUrl: `https://${window.location.host}/join/department_manager/${d.department_join_code}`,
        joinCode: d.department_join_code,
        id: d.id,
      }))
    : data;
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
  };

  const confirmDelete = name => {
    setShowDeleteDialog(true);
    //add which department about to delete in text of dialog
    setDeleteDialogActions([
      <Button
        key="alertdialog-edit"
        color="secondary"
        onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>,
      <Button
        key="alertdialog-confirm"
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
    }
  };

  const setDialog = () => {
    setDialogTitle('Please fill in the new departments name:');
    setDialogContent([
      <div className={styles.alertContent}>
        <Input
          className={styles.input}
          key={'new-department-name'}
          variant="filled"
          onChange={value => (newRow.name = value)}
        />
      </div>,
    ]);
    setDialogActions([
      <Button
        key="alertdialog-edit"
        color="secondary"
        onClick={() => setShowDialog(false)}>
        Cancel
      </Button>,
      <Button key="alertdialog-confirm" onClick={() => addRow()}>
        Add
      </Button>,
    ]);
    setDialogText(null);
    setShowDialog(true);
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
        variant="contained"
        color="primary"
        onClick={() => setDialog()}>
        <div className={styles.buttonText}>Add new department</div>
      </Button>

      <Table data={localData} autoHeight virtualized bordered>
        {columns.map(column => (
          <Table.Column key={column.id} flexGrow={column.flexGrow}>
            <Table.HeaderCell>{column.label}</Table.HeaderCell>
            <Table.Cell dataKey={column.id} />
          </Table.Column>
        ))}
        <Table.Column flexGrow={1}>
          <Table.HeaderCell>Actions</Table.HeaderCell>
          <Table.Cell>
            {rowData => (
              <div>
                <CopyToClipboard text={rowData.joinUrl}>
                  <Button appearance="primary">
                    <Icon icon="clone" />
                  </Button>
                </CopyToClipboard>
                <Button
                  appearance="primary"
                  onClick={() => regenerateCode(rowData.id)}>
                  Re-generate URL
                </Button>
                <Button
                  appearance="primary"
                  onClick={() => confirmDelete(rowData.department)}>
                  Delete
                </Button>
              </div>
            )}
          </Table.Cell>
        </Table.Column>
      </Table>
    </div>
  );
}
