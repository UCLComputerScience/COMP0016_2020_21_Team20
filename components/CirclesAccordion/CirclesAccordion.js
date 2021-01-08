import { makeStyles } from '@material-ui/core/styles';
import Accordion from '@material-ui/core/Accordion';
import AccordionSummary from '@material-ui/core/AccordionSummary';
import AccordionDetails from '@material-ui/core/AccordionDetails';
import Typography from '@material-ui/core/Typography';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';

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

export default function CirclesAccordion(props) {
  const classes = useStyles();
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
            {props.circles.map((c, i) => (
              <Circle
                key={i}
                name={c.name}
                color={c.color}
                percentage={c.percentage}
              />
            ))}
          </div>
        </AccordionDetails>
      </Accordion>
    </div>
  );
}
