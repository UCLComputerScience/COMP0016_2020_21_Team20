import { useState } from 'react';
import { Input, Alert } from 'rsuite';
import { mutate } from 'swr';

import styles from './UrlsTable.module.css';

import useSWR from '../../lib/swr';
import { ClinicianJoinCode, CustomTable } from '..';

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

export default function UrlsTable({ session }) {
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
    Alert.success('URL updated', 3000);
  };

  const setToDefaultUrl = async id => {
    await setToDefaultInDatabase(id);
    //to ensure no stale data, so refetch
    mutate('/api/questions');
    Alert.success('URL set to default suggested URL', 3000);
  };

  return (
    <div>
      <ClinicianJoinCode session={session} />
      <CustomTable
        tableType="urls"
        data={localData}
        columns={columns}
        editing={editing}
        sendData={() => sendData()}
        cancelEditing={() => cancelEditing()}
        setEditing={i => setEditing(i)}
        setToDefaultUrl={id => setToDefaultUrl(id)}
      />
    </div>
  );
}
