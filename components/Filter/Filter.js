import { DateFilter, VisualisationFilter } from '..';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import styles from './filter.module.css';

import { useRouter } from 'next/router';
import { signIn, useSession } from 'next-auth/client';
import roles from '../../lib/roles';

const useStyles = makeStyles(theme => ({
  root: {
    '& > *': {
      margin: theme.spacing(1),
    },
  },
}));

export function Filter(props) {
  const classes = useStyles();
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
