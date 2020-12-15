import { DateFilter, VisualisationFilter } from '..';
import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';

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
    <>
      <h2>Filters:</h2>
      <DateFilter />
      <VisualisationFilter />
      <Button variant="contained" color="secondary">
        Apply Filters
      </Button>
    </>
  );
}
export default Filter;
