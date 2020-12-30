import { DateFilter, VisualisationFilter } from '..';
import React from 'react';
import Button from '@material-ui/core/Button';
import styles from './filter.module.css';

export function Filter(props) {
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h3>Filters:</h3>
      </div>

      <div className={styles.dateFilter}>
        <DateFilter />
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
