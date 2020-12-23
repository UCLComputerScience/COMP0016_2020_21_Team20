import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import Paper from '@material-ui/core/Paper';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableContainer from '@material-ui/core/TableContainer';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { Button, Input } from '@material-ui/core';
import CreateIcon from '@material-ui/icons/Create';
import ClearIcon from '@material-ui/icons/Clear';
import SaveIcon from '@material-ui/icons/Save';

import styles from './UrlTable.module.css';
import useSWR from '../../lib/swr';
import { mutate } from 'swr';


const columns = [
  {
    id: 'question', label: 'Question body', minWidth: 50,
    render: (editing, i, row) => (
      row['body']
    )
  },
  {
    id: 'standard', label: 'Standard', minWidth: 50,
    render: (editing, i, row) => (
      row['standards']['name']
    )
  },
  {
    id: 'url',
    label: 'Training URL',
    minWidth: 50,
    render: (editing, i, row, localRow) => {
      if (editing === i) { //if this url is being editted then it needs to be an input box
        //copy all the info about the row being currently edited
        let buffer = {};
        editedRow = Object.assign(buffer, localRow);
        return <Input
          className={styles.input}
          key={row['standards']['name']}
          defaultValue={row['url']}
          variant="filled"
          onChange={event =>
            (editedRow.url = event.target.value)
          }
        />
      } else { //else just display url as link
        return <a href={row['url']} target="_blank">
          {row['url']}
        </a>
      }
    }
  },
  { id: 'actions', label: 'Actions', minWidth: 50 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/questions', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data ? data.likert_scale : [];
};

var editedRow = null;

export default function StickyHeadTable() {
  const classes = useStyles();
  const [editing, setEditing] = useState(null);
  let localData = useDatabaseData();
  let idToReset = null;

  const sendDataToDatabase = async () => {
    const res = await fetch('/api/question_urls/' + editedRow['id'], {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        url: editedRow['url'],
      }),
    });
    return await res.json();
  };

  const setToDefaultInDatabase = async () => {
    const res = await fetch('/api/question_urls/' + idToReset, {
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
    mutate('/api/questions');
  };

  const sendData = () => {
    sendDataToDatabase();
    setEditing(null);
    //to ensure no stale data, so refetch
    mutate('/api/questions');
  };

  const setToDefaultUrl = (id) => {
    console.log("id:", id);
    idToReset = id;
    console.log("id:", idToReset);
    setToDefaultInDatabase();
    idToReset = null;
    //to ensure no stale data, so refetch
    mutate('/api/questions');
  };

  return (
    <div>
      <Paper className={classes.root}>
        <TableContainer className={classes.container}>
          <Table stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                {columns.map(column => (
                  <TableCell
                    key={column.id}
                    align={column.align}
                    style={{ minWidth: column.minWidth }}>
                    <div className={styles.header}>
                      {column.label}
                    </div>
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
                            column.render(editing, i, row, localData[i])
                          ) : editing === i ? (
                            <div>
                              <Button
                                variant="contained"
                                color="primary"
                                onClick={() => sendData()}>
                                <SaveIcon fontSize="inherit" />
                              </Button>
                              {' '}
                              <Button
                                variant="contained"
                                color="secondary"
                                onClick={() => cancelEditing()}>
                                <ClearIcon fontSize="inherit" />
                              </Button>
                            </div>
                          ) : (
                                <div className={styles.buttonRow}>
                                  <Button
                                    variant="contained"
                                    color="primary"
                                    onClick={() => setEditing(i)}>
                                    <CreateIcon fontSize="inherit" />
                                  </Button>
                                  {' '}
                                  <Button
                                    variant="contained"
                                    color="secondary"
                                    onClick={() => setToDefaultUrl(row['id'])}>
                                    <div className={styles.buttonText}>
                                      Set to Default
                                    </div>
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
