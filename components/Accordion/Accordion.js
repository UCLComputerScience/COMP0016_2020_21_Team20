import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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
  circlesWrapper: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%',
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
          <div className={classes.circlesWrapper}>
            <Circle
              name="Safely"
              color={colors.STANDARD_SAFE}
              percentage={Math.round(Math.random() * 100)}
            />
            <Circle
              name="Timely"
              color={colors.STANDARD_TIMELY}
              percentage={Math.round(Math.random() * 100)}
            />
            <Circle
              name="Individualised"
              color={colors.STANDARD_INDIVIDUALISED}
              percentage={Math.round(Math.random()) * 100}
            />
            <Circle
              name="Healthy"
              color={colors.STANDARD_HEALTHY}
              percentage={Math.round(Math.random() * 100)}
            />
            <Circle
              name="Staff"
              color={colors.STANDARD_STAFF}
              percentage={Math.round(Math.random() * 100)}
            />
            <Circle
              name="Dignified"
              color={colors.STANDARD_DIGNIFIED}
              percentage={Math.round(Math.random() * 100)}
            />
            <Circle
              name="Effective"
              color={colors.STANDARD_EFFECTIVE}
              percentage={Math.round(Math.random() * 100)}
            />
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
