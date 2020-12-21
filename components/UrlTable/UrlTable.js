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

const columns = [
  { id: 'question', label: 'Question body', minWidth: 50 },
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

var rows = [
  //currently hard coded but will need get this from db
  {
    question:
      'I am confident/reassured that I have screened for serious pathology to an appropriate level in this case.',
    standard: 'Staff and Resources',
    url: 'https://example.com',
  },
  {
    question:
      'I have applied knowledge of best evidence to the context of this patient’s presentation to present appropriate treatment options to the patient.',
    standard: 'Staying Healthy',
    url: 'https://example2.com',
  },
  {
    question:
      'I have optimised the opportunity in our interaction today to discuss relevant activities and behaviours that support wellbeing and a healthy lifestyle for this patient.',
    standard: 'Individual Care',
    url: 'https://example3.com',
  },
  {
    question:
      'I have listened and responded with empathy to the patient’s concerns.',
    standard: 'Timely Care',
    url: 'https://example4.com',
  },
  {
    question:
      'I have supported the patient with a shared decision making process to enable us to agree a management approach that is informed by what matters to them.',
    standard: 'Dignified Care',
    url: 'https://example5.com',
  },
  {
    question:
      'I have established progress markers to help me and the patient monitor and evaluate the success of the treatment plan.',
    standard: 'Effective Care',
    url: 'https://example6.com',
  },
  {
    question:
      'My reflection/discussion about this interaction has supported my development through consolidation or a unique experience I can learn from.',
    standard: 'Safe Care',
    url: 'https://example7.com',
  },
];

export default function StickyHeadTable() {
  const classes = useStyles();
  const [editing, setEditing] = useState(null);
  var newData = rows.map(row => ({
    question: row.question,
    standard: row.standard,
    url: row.url,
    edit: row.edit,
  }));

  const setToDatabaseData = () => {
    newData = rows.map(row => ({
      question: row.question,
      standard: row.standard,
      url: row.url,
      edit: row.edit,
    }));
  };

  const cancelEditing = () => {
    setEditing(false);
    setToDatabaseData;
  };

  const sendData = () => {
    //will need to send data to db here, then set this data in local copy for table
    rows[editing].url = newData[editing].url
    setEditing(null);
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
              {rows.map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {columns.map(column => {
                      const value = row[column.id];
                      return (
                        <TableCell key={column.id} align={column.align}>
                          {column.id === 'url' && editing === i ? (
                            <Input
                              className={styles.input}
                              key={row['standard']}
                              defaultValue={row['url']}
                              variant="filled"
                              onChange={event =>
                                (newData[i].url = event.target.value)
                              }
                            />
                          ) : column.id === 'url' ? (
                            column.format(value)
                          ) : column.id === 'actions' && editing === i ? (
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
                          ) : column.id === 'actions' ? (
                            <Button
                              variant="contained"
                              color="primary"
                              onClick={() => setEditing(i)}>
                              <CreateIcon fontSize="inherit" />
                            </Button>
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
