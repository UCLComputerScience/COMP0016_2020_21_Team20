import { useState } from 'react';
import { Input, Alert, Button, Icon } from 'rsuite';
import { mutate } from 'swr';
import styles from './UrlsTable.module.css';

import PropTypes from 'prop-types';
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
    width: 'auto',
    render: (edited, row) => row['standards']['name'],
  },
  {
    id: 'url',
    label: 'Training URL',
    width: 'auto',
    render: (edited, row, host, i) => {
      if (edited) {
        //if this url is being edited then it needs to be an input box
        //copy all the info about the row being currently edited
        let buffer = {};
        editedRow = Object.assign(buffer, row);
        return (
          <Input
            id={'url' + i}
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

const useDatabaseData = () => {
  const { data, error } = useSWR('/api/questions', {
    revalidateOnFocus: false,
    revalidateOnReconnect: false,
  });

  if (data) {
    return {
      data: data ? data.likert_scale : [],
      error: error || data.error,
      message: data.message,
    };
  }
  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;

export default function UrlsTable({ session, host }) {
  const [editing, setEditing] = useState(null);
  const { data, error, message } = useDatabaseData();
  const localData = data;
  if (error) {
    Alert.error(
      "Error: '" +
        message +
        "'. Please reload/try again later or the contact system administrator",
      0
    );
  }

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

  const renderActionCells = (editing, row, i, host) => {
    if (editing === i) {
      return (
        <div className={styles.actionButtons}>
          <Button
            id={'saveEdit' + i}
            appearance="primary"
            onClick={() => sendData()}>
            <Icon icon="save" />
          </Button>
          <Button color="red" onClick={() => cancelEditing()}>
            <Icon icon="close" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.actionButtons}>
          <Button
            id={'edit' + i}
            appearance="primary"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button>
          <Button
            id={'setDefault' + i}
            color="red"
            onClick={() => setToDefaultUrl(row['id'])}>
            Set to Default
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      <ClinicianJoinCode session={session} host={host} />
      <CustomTable
        data={localData}
        columns={columns}
        renderActionCells={renderActionCells}
        editing={editing}
      />
    </div>
  );
}

UrlsTable.propTypes = {
  /** The session of the users webpage, used to fecth the correct join code from the backend*/
  session: PropTypes.object.isRequired,
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
};
