import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from '@material-ui/core';

import PropTypes from 'prop-types';
import styles from './CustomTable.module.css';

function CustomTable(props) {
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
            props.data.map((row, i) => (
              <TableRow hover role="checkbox" tabIndex={-1} key={row.code}>
                {props.columns.map(column => (
                  <TableCell
                    className={styles.tableCell}
                    key={column.id}
                    align={column.align}>
                    {column.id === 'actions'
                      ? props.renderActionCells(props.editing, row, i)
                      : column.render(props.editing === i, row, props.host, i)}
                  </TableCell>
                ))}
              </TableRow>
            ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
}

CustomTable.propTypes = {
  /** The hostname of the website*/
  host: PropTypes.string,
  /** Array containing data to be displayed in the table */
  data: PropTypes.array.isRequired,
  /** Array containg the defined coloumns of table */
  columns: PropTypes.array.isRequired,
  /** Function that is used to render the action column cells in the table */
  renderActionCells: PropTypes.func.isRequired,
  /** The index of the data that is being editted */
  editing: PropTypes.bool.isRequired,
};

export default CustomTable;
