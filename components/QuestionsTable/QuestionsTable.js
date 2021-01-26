import { useState } from 'react';
import { Button, Icon, Input, SelectPicker, Alert } from 'rsuite';
import { mutate } from 'swr';

import styles from './QuestionsTable.module.css';

import { AlertDialog, CustomTable } from '../';
import useSWR from '../../lib/swr';

const columns = [
  {
    id: 'question',
    label: 'Question body',
    width: '40%',
    render: (edited, row) => {
      if (edited) {
        //if this url is being edited then it needs to be an input box
        //copy all the info about the row being currently edited
        let buffer = {};
        editedRow = Object.assign(buffer, row);
        return (
          <Input
            className={styles.input}
            key={row['standards']['name']}
            defaultValue={row['body']}
            onChange={value => (editedRow.body = value)}
          />
        );
      } else {
        //else just display body
        return <div>{row['body']}</div>;
      }
    },
  },
  {
    id: 'standard',
    label: 'Standard',
    width: 'auto',
    render: (edited, row) => <div>{row['standards']['name']}</div>,
  },
  {
    id: 'url',
    label: 'Training URL',
    width: 'auto',
    render: (edited, row) => {
      if (edited) {
        //if this url is being edited then it needs to be an input box
        //copy all the info about the row being currently edited
        let buffer = {};
        editedRow = Object.assign(buffer, row);
        return (
          <Input
            className={styles.input}
            key={row['standards']['name']}
            defaultValue={row['url']}
            onChange={value => (editedRow.url = value)}
          />
        );
      } else {
        //else just display url as link
        return (
          <a href={row['url']} target="_blank">
            {row['url']}
          </a>
        );
      }
    },
  },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

// TODO error handling
const useDatabaseData = () => {
  const { data, error } = useSWR('/api/questions?default_urls=1', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data ? data.likert_scale : [];
};

// TODO error handling
const getStandards = () => {
  const { data, error } = useSWR('/api/standards', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data;
};

var standards = [];
var editedRow = null;

export default function QuestionsTable() {
  const [editing, setEditing] = useState(false);
  const [showDialog, setShowDialog] = useState(false);
  const [dialogTitle, setDialogTitle] = useState(null);
  const [dialogText, setDialogText] = useState(null);
  const [dialogContent, setDialogContent] = useState([]);
  const [dialogActions, setDialogActions] = useState([]);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [deleteDialogActions, setDeleteDialogActions] = useState([]);
  var newRow = { body: null, url: null, standard: -1, type: 'likert_scale' };
  let localData = useDatabaseData();
  standards = getStandards();

  const resetNewRow = () => {
    newRow = { body: null, url: null, standard: -1, type: 'likert_scale' };
  };

  const sendUpdatedToDatabase = async () => {
    const res = await fetch('/api/questions/' + editedRow['id'], {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: editedRow['body'],
        url: editedRow['url'],
      }),
    });
    return await res.json();
  };

  const sendNewToDatabase = async () => {
    const res = await fetch('/api/questions/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        body: newRow.body,
        url: newRow.url,
        standard: newRow.standard,
        type: newRow.type,
      }),
    });
    return await res.json();
  };

  const deleteInDatabase = async id => {
    const res = await fetch('/api/questions/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    });
    return await res.json();
  };

  const cancelEditing = () => {
    //no row is being edited so reset this value
    editedRow = null;
    setEditing(null);
    //to ensure no stale data, so refetch
    mutate('/api/questions?default_urls=1');
  };

  const sendUpdated = async () => {
    await sendUpdatedToDatabase();
    setEditing(null);
    //to ensure no stale data, so refetch
    mutate('/api/questions?default_urls=1');
    Alert.success('Question successfully updated', 3000);
  };

  const deleteRow = async id => {
    await deleteInDatabase(id);
    //to ensure no stale data, so refetch
    mutate('/api/questions?default_urls=1');
    setShowDeleteDialog(false);
    Alert.success('Question successfully deleted', 3000);
  };

  const confirmDelete = id => {
    setShowDeleteDialog(true);
    setDeleteDialogActions([
      <Button
        key="alertdialog-edit"
        color="red"
        onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>,
      <Button
        key="alertdialog-confirm"
        onClick={() => deleteRow(id)}
        appearance="primary">
        Yes
      </Button>,
    ]);
  };

  const addRow = async () => {
    if (!newRow.body || newRow.standard === -1 || !newRow.url) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      await sendNewToDatabase();
      setShowDialog(false);
      resetNewRow();
      //to ensure no stale data, so refetch
      mutate('/api/questions?default_urls=1');
      Alert.success('New question successfully added', 3000);
    }
  };

  const setDialog = () => {
    setDialogTitle('Please fill in the information of the new question:');
    setDialogContent([
      <div>
        <label>Body:</label>
        <Input
          className={styles.input}
          onChange={value => (newRow.body = value)}
        />
        <label>Standard:</label>
        <br />
        <SelectPicker
          defaultValue={newRow.standard}
          onChange={value => (newRow.standard = value)}
          placeholder="Choose Standard"
          data={standards.map(standard => ({
            label: standard.name,
            value: standard.id,
          }))}
        />
        <br />
        <label>Url:</label>
        <br />
        <Input
          className={styles.input}
          onChange={value => (newRow.url = value)}
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

  return (
    <div>
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
        title={'Are you sure you want to delete this question?'}
        text={'Deleting a question cannot be undone.'}
        actions={deleteDialogActions}
      />
      <Button
        className={styles.buttons}
        appearance="primary"
        onClick={() => setDialog()}>
        <div>Add new question</div>
      </Button>
      <CustomTable
        tableType="questions"
        data={localData}
        columns={columns}
        editing={editing}
        sendUpdated={() => sendUpdated()}
        cancelEditing={() => cancelEditing()}
        setEditing={i => setEditing(i)}
        confirmDelete={id => confirmDelete(id)}
      />
    </div>
  );
}
