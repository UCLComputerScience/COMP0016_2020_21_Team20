import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import {
  Button,
  Input,
  Select,
  MenuItem,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  InputLabel,
} from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';

import { AlertDialog } from '../';
import styles from './QuestionsTable.module.css';
import useSWR from '../../lib/swr';
import { mutate } from 'swr';

const columns = [
  {
    id: 'question',
    label: 'Question body',
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
            defaultValue={row['body']}
            variant="filled"
            onChange={event => (editedRow.body = event.target.value)}
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
    width: '15%',
    render: (edited, row) => {
      if (edited) {
        //if this url is being edited then it needs to be an input box
        //copy all the info about the row being currently edited
        let buffer = {};
        editedRow = Object.assign(buffer, row);
        return (
          <Select
            id={row['body']}
            defaultValue={editedRow.standards.id}
            onChange={handleStandardChange}>
            {standards.map(standard => (
              <MenuItem value={standard.id}>{standard.name}</MenuItem>
            ))}
          </Select>
        );
      } else {
        //else just display standards name
        return <div>{row['standards']['name']}</div>;
      }
    },
  },
  {
    id: 'url',
    label: 'Training URL',
    width: '35%',
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
            variant="filled"
            onChange={event => (editedRow.url = event.target.value)}
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
  { id: 'actions', label: 'Actions', width: '15%' },
];

const handleStandardChange = event => {
  editedRow.standards.id = event.target.value;
};

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
});

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/questions?default_urls=1', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data ? data.likert_scale : [];
};

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
  const classes = useStyles();
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
        standard: editedRow['standards']['id'],
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
  };

  const deleteRow = async id => {
    await deleteInDatabase(id);
    //to ensure no stale data, so refetch
    mutate('/api/questions?default_urls=1');
    setShowDeleteDialog(false);
  };

  const confirmDelete = id => {
    setShowDeleteDialog(true);
    setDeleteDialogActions([
      <Button
        key="alertdialog-edit"
        color="secondary"
        onClick={() => setShowDeleteDialog(false)}>
        Cancel
      </Button>,
      <Button key="alertdialog-confirm" onClick={() => deleteRow(id)}>
        Yes
      </Button>,
    ]);
  };

  const addRow = async () => {
    if (newRow.body === null || newRow.standard === -1 || newRow.url === null) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      await sendNewToDatabase();
      setShowDialog(false);
      resetNewRow();
      //to ensure no stale data, so refetch
      mutate('/api/questions?default_urls=1');
    }
  };

  const setDialog = () => {
    setDialogTitle('Please fill in the information of the new question:');
    setDialogContent([
      <div className={styles.alertContent}>
        <div>Body:</div>
        <Input
          className={styles.input}
          key={'new-body'}
          variant="filled"
          onChange={event => (newRow.body = event.target.value)}
        />
        <div>Standard:</div>
        <Select
          id="new-standard"
          defaultValue={newRow.standard}
          onChange={event => (newRow.standard = event.target.value)}>
          <MenuItem value={-1} disabled>
            Choose Standard
          </MenuItem>
          {standards.map(standard => (
            <MenuItem value={standard.id}>{standard.name}</MenuItem>
          ))}
        </Select>
        <div>Url:</div>
        <Input
          className={styles.input}
          key={'new-url'}
          variant="filled"
          onChange={event => (newRow.url = event.target.value)}
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
      <AlertDialog
        open={showDialog}
        title={dialogTitle}
        text={dialogText}
        content={dialogContent}
        actions={dialogActions}
      />
      <AlertDialog
        open={showDeleteDialog}
        title={'Are you sure you want to delete this question?'}
        text={'Deleting a question cannot be undone.'}
        actions={deleteDialogActions}
      />
      <Button
        className={styles.buttons}
        variant="contained"
        color="primary"
        onClick={() => setDialog()}>
        <div className={styles.buttonText}>Add new question</div>
      </Button>
      <Paper className={classes.root}>
        <TableContainer>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ width: column.width }}>
                    <div className={styles.header}>{column.label}</div>
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {localData.map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id !== 'actions' ? (
                            column.render(editing === i, row)
                          ) : editing === i ? (
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => sendUpdated()}>
                                <SaveIcon fontSize="inherit" />
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => cancelEditing()}>
                                <ClearIcon fontSize="inherit" />
                              </Button>
                            </div>
                          ) : (
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => setEditing(i)}>
                                <CreateIcon fontSize="inherit" />
                              </Button>
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => confirmDelete(row['id'])}>
                                <div className={styles.buttonText}>Delete</div>
                              </Button>
                            </div>
                          )}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </div>
  );
}
