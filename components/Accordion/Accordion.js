import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

import styles from './accordion.module.css';

import { Circle } from '..';
/** 
const circles = [
  {
    question: 'Timely Care',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
];
*/
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
            {/* <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div>
            <div className={styles.circle}>
              <Circle />
            </div> */}
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
            <Circle />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
