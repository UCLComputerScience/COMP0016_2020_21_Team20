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
    render: (edited, row, host, i) => {
      if (edited) {
        // If this question is being edited then it needs to be an input box
        // Copy all the info about the row being currently edited
        const buffer = {};
        Object.assign(buffer, row);
        editedRow = buffer;
        return (
          <Input
            id={'questionInput' + i}
            className={styles.input}
            key={row.standards.name}
            defaultValue={row.body}
            onChange={value => (editedRow.body = value)}
          />
        );
      } else {
        // Else just display body
        return <div id={'question' + i}>{row.body}</div>;
      }
    },
  },
  {
    id: 'standard',
    label: 'Standard',
    width: 'auto',
    render: (edited, row) => row.standards.name,
  },
  {
    id: 'url',
    label: 'Training URL',
    width: 'auto',
    render: (edited, row) => {
      if (edited) {
        // If this url is being edited then it needs to be an input box
        // Copy all the info about the row being currently edited
        const buffer = {};
        Object.assign(buffer, row);
        editedRow = buffer;
        return (
          <Input
            className={styles.input}
            key={row.standards.name}
            defaultValue={row.url}
            onChange={value => (editedRow.url = value)}
          />
        );
      } else {
        // Else just display URL as link
        return (
          <a href={row.url} target="_blank" rel="noopener noreferrer">
            {row.url}
          </a>
        );
      }
    },
  },
  { id: 'actions', label: 'Actions', width: 'auto' },
];

const useQuestions = () => {
  const { data, error } = useSWR('/api/questions?default_urls=1');

  if (data) {
    return {
      data: data ? data.likert_scale : [],
      error: error || data.error,
      message: data.message,
    };
  }

  return { data: null, error: error, message: error ? error.message : null };
};

const useStandards = () => {
  const { data, error } = useSWR('/api/standards');

  if (data) {
    return { data: data, error: error || data.error, message: data.message };
  }

  return { data: null, error: error, message: error ? error.message : null };
};

var editedRow = null;
export default function QuestionsTable() {
  const [editing, setEditing] = useState(false);
  const [showNewQuestionDialog, setShowNewQuestionDialog] = useState(false);
  const [dialogText, setDialogText] = useState(null);

  const {
    data: questions,
    error: questionsError,
    message: questionsMessage,
  } = useQuestions();

  const {
    data: standards,
    error: standardsError,
    message: standardsMessage,
  } = useStandards();

  var newRow = { body: null, url: null, standard: -1, type: 'likert_scale' };

  if (questionsError) {
    Alert.error(
      `Error: ${questionsMessage}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  if (standardsError) {
    Alert.error(
      `Error: ${standardsMessage}. Please reload/try again later or the contact system administrator`,
      0
    );
  }

  const updateQuestion = async () => {
    const res = await fetch('/api/questions/' + editedRow.id, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ body: editedRow.body, url: editedRow.url }),
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      setEditing(null);
      // Refetch to ensure no stale data
      mutate('/api/questions?default_urls=1');
      Alert.success('Question successfully updated', 3000);
    }
  };

  const deleteQuestion = async id => {
    const res = await fetch('/api/questions/' + id, {
      method: 'DELETE',
      headers: { 'Content-Type': 'application/json' },
    }).then(res => res.json());

    if (res.error) {
      Alert.error(res.message, 0);
    } else {
      // Refetch to ensure no stale data
      mutate('/api/questions?default_urls=1');
      Alert.success('Question successfully deleted', 3000);
    }
  };

  const addNewQuestion = async () => {
    if (!newRow.body || newRow.standard === -1 || !newRow.url) {
      setDialogText(
        <div className={styles.alertText}>*Please fill in each field</div>
      );
    } else {
      const res = await fetch('/api/questions/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          body: newRow.body,
          url: newRow.url,
          standard: newRow.standard,
          type: newRow.type,
        }),
      }).then(res => res.json());

      if (res.error) {
        Alert.error(res.message, 0);
      } else {
        setShowNewQuestionDialog(false);
        newRow = { body: null, url: null, standard: -1, type: 'likert_scale' };

        // Refetch to ensure no stale data
        mutate('/api/questions?default_urls=1');
        Alert.success('New question successfully added', 3000);
      }
    }
  };

  const renderActionCells = (editing, row, i, host) => {
    if (editing === i) {
      return (
        <div className={styles.actionButtons}>
          <Button
            id={'saveEdit' + i}
            id={'saveEdit' + i}
            appearance="primary"
            onClick={() => updateQuestion()}>
            <Icon icon="save" />
          </Button>
          <Button
            aria-label={'cancelEdit' + i}
            color="red"
            onClick={() => {
              // No row is being edited so reset this value
              editedRow = null;
              setEditing(null);
              // Refetch to ensure no stale data
              mutate('/api/questions?default_urls=1');
            }}>
            <Icon icon="close" />
          </Button>
        </div>
      );
    } else {
      return (
        <div className={styles.actionButtons}>
          <Button
            aria-label={'edit' + i}
            id={'edit' + i}
            appearance="primary"
            onClick={() => setEditing(i)}>
            <Icon icon="pencil" />
          </Button>
          <Button
            color="red"
            onClick={async () => {
              if (
                window.confirm(
                  'Are you sure you want to delete this question?. Deleting a question cannot be undone.'
                )
              ) {
                await deleteQuestion(row.id);
              }
            }}>
            Delete
          </Button>
        </div>
      );
    }
  };

  return (
    <div>
      {standards && !standardsError && (
        <AlertDialog
          open={showNewQuestionDialog}
          setOpen={setShowNewQuestionDialog}
          title="Please fill in the information of the new question:"
          text={dialogText}
          content={[
            <div key="alertdialog-new-question">
              <label>Body:</label>
              <Input
                id="bodyText"
                className={styles.input}
                onChange={value => (newRow.body = value)}
              />
              <label>Standard:</label>
              <br />
              <SelectPicker
                defaultValue={newRow.standard}
                onChange={value => (newRow.standard = value)}
                placeholder={<text id="chooseStandard">Choose Standard</text>}
                data={standards.map(standard => ({
                  label: (
                    <text id={'standard' + standard.id}>{standard.name}</text>
                  ),
                  value: standard.id,
                }))}
              />
              <br />
              <label>Url:</label>
              <br />
              <Input
                id="urlText"
                className={styles.input}
                onChange={value => (newRow.url = value)}
              />
            </div>,
          ]}
          actions={[
            <Button
              key="alertdialog-edit"
              color="red"
              onClick={() => setShowNewQuestionDialog(false)}>
              Cancel
            </Button>,
            <Button
              id="addQuestion"
              key="alertdialog-confirm"
              onClick={() => addNewQuestion()}
              appearance="primary">
              Add
            </Button>,
          ]}
        />
      )}

      <Button
        id="addNewQuestion"
        className={styles.buttons}
        appearance="primary"
        onClick={() => {
          setDialogText(null);
          setShowNewQuestionDialog(true);
        }}>
        <div>Add new question</div>
      </Button>

      <CustomTable
        data={questions}
        columns={columns}
        renderActionCells={renderActionCells}
        editing={editing}
      />
    </div>
  );
}
