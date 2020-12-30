import { useState } from 'react';

import Button from '@material-ui/core/Button';
import { DateRange } from 'react-date-range';

import { VisualisationFilter } from '..';

import styles from './filter.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

export function Filter(props) {
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: null, key: 'selection' },
  ]);

  console.log(dateRange);
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h3>Filters:</h3>
      </div>

      <div className={styles.dateFilter}>
        <DateRange
          editableDateInputs={true}
          onChange={item => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
        />
      </div>
      <div className={styles.visualisationFilter}>
        <VisualisationFilter />
      </div>
      <div className={styles.button}>
        <Button variant="contained" color="secondary">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default Filter;
