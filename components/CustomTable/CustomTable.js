import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';
import { Button, Input, Icon } from 'rsuite';
import { CopyToClipboard } from 'react-copy-to-clipboard';

import styles from './CustomTable.module.css';
import roles from '../../lib/roles';

const renderDepartments = [
    {
        id: 0,
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
                        ) : props.editing === i ? (
                          'not done'
                        ) : (
                            renderDepartments[0].render(false, row, 
                                () => props.showCopyAlert(),
                                (id) => props.regenerateCode(id),
                                (name) => props.confirmDelete(name))
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
    );
}

export default CustomTable;
