import { useState } from 'react';
import { Button, Input, Icon } from 'rsuite';
import { mutate } from 'swr';
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import styles from './UrlTable.module.css';

import useSWR from '../../lib/swr';
import { ClinicianJoinCode } from '..';

const columns = [
  {
    id: 'question',
    label: 'Question body',
    width: '40%',
    render: (edited, row) => row['body'],
  },
  {
    id: 'standard',
    label: 'Standard',
    width: '10%',
    render: (edited, row) => row['standards']['name'],
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
  { id: 'actions', label: 'Actions', width: '15%' },
];

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/questions', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  return data ? data.likert_scale : [];
};

var editedRow = null;

export default function UrlTable() {
  const [editing, setEditing] = useState(null);
  let localData = useDatabaseData();

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

  const setToDefaultInDatabase = async id => {
    const res = await fetch('/api/question_urls/' + id, {
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

  const sendData = async () => {
    await sendDataToDatabase();
    setEditing(null);
    //to ensure no stale data, so refetch
    mutate('/api/questions');
  };

  const setToDefaultUrl = async id => {
    await setToDefaultInDatabase(id);
    //to ensure no stale data, so refetch
    mutate('/api/questions');
  };

  return (
    <div>
      <ClinicianJoinCode />
      <TableContainer>
        <Table stickyHeader>
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
                          <div className={styles.actionButtons}>
                            <Button
                              appearance="primary"
                              onClick={() => sendData()}>
                              <Icon icon="save" />
                            </Button>
                            <Button color="red" onClick={() => cancelEditing()}>
                              <Icon icon="close" />
                            </Button>
                          </div>
                        ) : (
                          <div className={styles.actionButtons}>
                            <Button
                              appearance="primary"
                              onClick={() => setEditing(i)}>
                              <Icon icon="pencil" />
                            </Button>
                            <Button
                              color="red"
                              onClick={() => setToDefaultUrl(row['id'])}>
                              Set to Default
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
    </div>
  );
}
