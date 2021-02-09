import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Button, Icon } from 'rsuite';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import PropTypes from 'prop-types';
import styles from './CustomTable.module.css';
import { Roles } from '../../lib/constants';

const typeOfTable = {
  DEPARTMENTS: 0,
  URLS: 1,
  QUESTIONS: 2,
};

const renderCells = [
  {
    id: typeOfTable.DEPARTMENTS,
    render: (
      editing,
      row,
      showCopyAlert,
      regenerateCode,
      confirmDelete,
      host
    ) => {
      return (
        <div className={styles.actionButtons}>
          <CopyToClipboard
            text={`https://${host}/join/${Roles.USER_TYPE_DEPARTMENT}/${row['department_join_code']}`}>
            <Button appearance="primary" onClick={() => showCopyAlert()}>
              <Icon icon="clone" />
            </Button>
          </CopyToClipboard>
          <Button
            appearance="primary"
            onClick={() => regenerateCode(row['id'])}>
            Re-generate URL
          </Button>
          <Button color="red" onClick={() => confirmDelete(row['id'])}>
            Delete
          </Button>
        </div>
      );
    },
  },
  {
    id: typeOfTable.URLS,
    render: (
      editing,
      row,
      sendData,
      cancelEditing,
      setEditing,
      setToDefaultUrl,
      i
    ) => {
      if (editing === i) {
        return (
          <div className={styles.actionButtons}>
            <Button appearance="primary" onClick={() => sendData()}>
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
            <Button appearance="primary" onClick={() => setEditing(i)}>
              <Icon icon="pencil" />
            </Button>
            <Button color="red" onClick={() => setToDefaultUrl(row['id'])}>
              Set to Default
            </Button>
          </div>
        );
      }
    },
  },
  {
    id: typeOfTable.QUESTIONS,
    render: (
      editing,
      row,
      sendUpdated,
      cancelEditing,
      setEditing,
      confirmDelete,
      i
    ) => {
      if (editing === i) {
        return (
          <div className={styles.actionButtons}>
            <Button appearance="primary" onClick={() => sendUpdated()}>
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
            <Button appearance="primary" onClick={() => setEditing(i)}>
              <Icon icon="pencil" />
            </Button>
            <Button color="red" onClick={() => confirmDelete(row['id'])}>
              Delete
            </Button>
          </div>
        );
      }
    },
  },
];

//props tableType localData, columns, editing
function CustomTable({ host, ...props }) {
  return (
    <TableContainer>
      <Table stickyHeader aria-label="sticky table">
        <TableHead>
          <TableRow>
            {props.columns.map(column => (
              <TableCell
                className={styles.tableCell}
                key={column.id}
                align={column.align}
                style={{ width: column.width }}>
                <div className={styles.header}>{column.label}</div>
              </TableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {props.data &&
            props.data.map((row, i) => {
              return (
                <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                  {props.columns.map(column => {
                    return (
                      <TableCell
                        className={styles.tableCell}
                        key={column.id}
                        align={column.align}>
                        {column.id !== 'actions'
                          ? column.render(props.editing === i, row, host)
                          : props.tableType === 'departments'
                          ? renderCells[typeOfTable.DEPARTMENTS].render(
                              props.editing,
                              row,
                              () => props.showCopyAlert(),
                              id => props.regenerateCode(id),
                              id => props.confirmDelete(id),
                              host
                            )
                          : props.tableType === 'urls'
                          ? renderCells[typeOfTable.URLS].render(
                              props.editing,
                              row,
                              () => props.sendData(),
                              () => props.cancelEditing(),
                              i => props.setEditing(i),
                              id => props.setToDefaultUrl(id),
                              i
                            )
                          : props.tableType === 'questions'
                          ? renderCells[typeOfTable.QUESTIONS].render(
                              props.editing,
                              row,
                              () => props.sendUpdated(),
                              () => props.cancelEditing(),
                              i => props.setEditing(i),
                              id => props.confirmDelete(id),
                              i
                            )
                          : null}
                      </TableCell>
                    );
                  })}
                </TableRow>
              );
            })}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomTable.propTypes = {
  /** The host name of the website*/
  host: PropTypes.string.isRequired,
  /** Array containing data to be displayed in the table */
  data: PropTypes.object.isRequired,
  /** Object containg the defined coloumns of table */
  columns: PropTypes.object.isRequired,
  /** The type of custom table: departments or urls or questions */
  tableType: PropTypes.string.isRequired,
  /** The index of the data that is being editted */
  editing: PropTypes.number.isRequired,
  /** Function that is triggered by using copy button in departments table (REQUIRED IN DEPARTMENTS TABLE ONLY)*/
  showCopyAlert: PropTypes.func,
  /** Function that is triggered by using regenerate button in departments table (REQUIRED IN DEPARTMENTS TABLE ONLY)*/
  regenerateCode: PropTypes.func,
  /** Function that is triggered by the delete button in departments and questions table (REQUIRED IN DEPARTMENTS AND QUESTIONS TABLE ONLY)*/
  confirmDelete: PropTypes.func,
  /** Function that is triggered by save button while editing in urls table (REQUIRED IN URLS TABLE ONLY)*/
  sendData: PropTypes.func,
  /** Function that is triggered by the x button in urls and questions table to stop the editing state (REQUIRED IN URLS AND QUESTIONS TABLE ONLY)*/
  cancelEditing: PropTypes.func,
  /** Function that is triggered by the pencil edit button in urls and questions table to edit a certain row (REQUIRED IN URLS AND QUESTIONS TABLE ONLY)*/
  setEditing: PropTypes.func,
  /** Function that is triggered by the set to default button in urls table which sets that URL to the default global URL (REQUIRED IN URLS TABLE ONLY)*/
  setToDefaultUrl: PropTypes.func,
};

export default CustomTable;
