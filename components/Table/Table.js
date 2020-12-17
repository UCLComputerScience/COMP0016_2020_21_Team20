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

import styles from './Table.module.css';

const columns = [
  { id: 'question', label: 'Question', minWidth: 50 },
  { id: 'standard', label: 'Standard', minWidth: 50 },
  {
    id: 'url',
    label: 'Training URL',
    minWidth: 50,
    format: value => (
      <a href={value} target="_blank">
        {value}
      </a>
    ),
  },
  { id: 'edit', label: '', minWidth: 50 },
];

const useStyles = makeStyles({
  root: {
    width: '100%',
  },
  container: {
    maxHeight: 440,
  },
});

var rows = [
  //currently hard coded but will need get this from db
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    standard: 'Timely care',
    url: 'https://example.com',
    edit: null,
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    standard: 'Safe care',
    url: 'https://example2.com',
    edit: null,
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standard: 'Dignified care',
    url: 'https://example3.com',
    edit: null,
  },
];

export default function StickyHeadTable() {
  const classes = useStyles();
  const [editing, setEditing] = useState(false);
  var newData = rows.map(row => ({
    question: row.question,
    standard: row.standard,
    url: row.url,
    edit: row.edit,
  }));

  const setToCurrentData = () => {
    newData = rows.map(row => ({
      question: row.question,
      standard: row.standard,
      url: row.url,
      edit: row.edit,
    }));
  };

  const handleEdit = () => {
    setEditing(!editing);
    setToCurrentData;
  };

  const sendData = () => {
    //will need to send data to db here, then set this data in local copy for table
    rows = newData.map(row => ({
      question: row.question,
      standard: row.standard,
      url: row.url,
      edit: row.edit,
    }));
    setEditing(false);
  };

  return (
    <div>
      <div className={styles.buttons}>
        <Button
          variant="contained"
          color={editing ? 'secondary' : 'primary'}
          onClick={() => handleEdit()}>
          {editing ? 'Discard changes' : "Edit URL's"}
        </Button>{' '}
        {editing && (
          <Button
            variant="contained"
            color="primary"
            onClick={() => sendData()}>
            Save changes
          </Button>
        )}
      </div>
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
                    {column.id === 'edit' && editing
                      ? 'New Training URL'
                      : column.label}
                  </TableCell>
                ))}
              </TableRow>
            </TableHead>
            <TableBody>
              {rows.map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'url' ? (
                            column.format(value)
                          ) : column.id === 'edit' && editing ? (
                            <Input
                              className={styles.input}
                              key={row['standard']}
                              defaultValue={row['url']}
                              variant="filled"
                              onChange={event =>
                                (newData[i].url = event.target.value)
                              }
                            />
                          ) : (
                            value
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
