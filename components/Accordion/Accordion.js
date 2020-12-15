import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styles from './accordion.module.css';
import colors from '../../lib/colors';

import { Circle } from '..';
const useStyles = makeStyles(theme => ({
  root: {
    width: '100%',
  },
  heading: {
    fontSize: theme.typography.pxToRem(15),
    fontWeight: theme.typography.fontWeightRegular,
  },
}));

export default function SimpleAccordion() {
  const classes = useStyles();
  /**I will be mapping through each circle individually to make it
            cleaner and the data will not be hardcoded*/
  return (
    <div className={classes.root}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header">
          <Typography className={classes.heading}>Quick Summary</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <div className={styles.circlesWrapper}>
            <Circle name="Safely" color={colors.STANDARD_SAFE} />
            <Circle name="Timely" color={colors.STANDARD_TIMELY} />
            <Circle
              name="Individualised"
              color={colors.STANDARD_INDIVIDUALISED}
            />
            <Circle name="Healthy" color={colors.STANDARD_HEALTHY} />
            <Circle name="Staff" color={colors.STANDARD_STAFF} />
            <Circle name="Dignified" color={colors.STANDARD_DIGNIFIED} />
            <Circle name="Effective" color={colors.STANDARD_EFFECTIVE} />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
