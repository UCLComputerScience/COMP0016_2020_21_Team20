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

import styles from './CustomTable.module.css';
import roles from '../../lib/roles';

const typeOfTable = {
    DEPARTMENTS: 0,
    URLS : 1,
    QUESTIONS : 2
}

const renderCells = [
    {
        id: typeOfTable.DEPARTMENTS,
        render:  (editing, row, showCopyAlert, regenerateCode, confirmDelete) => {
            return(
                <div className={styles.actionButtons}>
                    <CopyToClipboard
                    text={`https://${window.location.host}/join/${roles.USER_TYPE_DEPARTMENT}/${row['department_join_code']}`}>
                        <Button appearance="primary" onClick={() => showCopyAlert()}>
                            <Icon icon="clone" />
                        </Button>
                    </CopyToClipboard>
                    <Button
                    appearance="primary"
                    onClick={() => regenerateCode(row['id'])}>
                    Re-generate URL
                    </Button>
                    <Button
                    color="red"
                    onClick={() => confirmDelete(row['name'])}>
                    Delete
                    </Button>
                </div>
            );
            },
    },
    {
        id: typeOfTable.URLS,
        render:  (editing, row, sendData, cancelEditing, setEditing, setToDefaultUrl, i) => {
            if(editing === i) {
                return (
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
                );
            } else {
                return(
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
                );
            }
            },
    },
    {
        id: typeOfTable.QUESTIONS,
        render:  (editing, row, sendUpdated, cancelEditing, setEditing, confirmDelete, i) => {
            if(editing === i) {
                return (
                    <div className={styles.actionButtons}>
                        <Button
                            appearance="primary"
                            onClick={() => sendUpdated()}>
                            <Icon icon="save" />
                        </Button>
                        <Button color="red" onClick={() => cancelEditing()}>
                            <Icon icon="close" />
                        </Button>
                    </div>
                );
            } else {
                return(
                    <div className={styles.actionButtons}>
                        <Button
                            appearance="primary"
                            onClick={() => setEditing(i)}>
                            <Icon icon="pencil" />
                        </Button>
                        <Button
                            color="red"
                            onClick={() => confirmDelete(row['id'])}>
                            Delete
                        </Button>
                    </div>
                );
            }
            },
    },
];

//props tableType localData, columns, editing
function CustomTable(props) {  

    return (
    <TableContainer>
        <Table stickyHeader aria-label="sticky table">
          <TableHead>
            <TableRow>
              {props.columns.map(column => (
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
            {props.data !== undefined &&
              props.data.map((row, i) => {
                return (
                  <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                    {props.columns.map(column => {
                      return (
                        <TableCell key={column.id} align={column.align}>
                        {column.id !== 'actions' ? (
                          column.render(props.editing === i, row)
                        ) : props.tableType === 'departments' ? (
                            renderCells[typeOfTable.DEPARTMENTS].render(props.editing, row, 
                                () => props.showCopyAlert(),
                                (id) => props.regenerateCode(id),
                                (name) => props.confirmDelete(name))
                        ) : props.tableType === 'urls' ? (
                            renderCells[typeOfTable.URLS].render(props.editing, row, 
                                () => props.sendData(),
                                () => props.cancelEditing(),
                                (i) => props.setEditing(i),
                                (id) => props.setToDefaultUrl(id),
                                i)
                        ) : props.tableType === 'questions' ? (
                            renderCells[typeOfTable.QUESTIONS].render(props.editing, row, 
                                () => props.sendUpdated(),
                                () => props.cancelEditing(),
                                (i) => props.setEditing(i),
                                (id) => props.confirmDelete(id),
                                i)
                        ) : (null)}
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

export default CustomTable;
