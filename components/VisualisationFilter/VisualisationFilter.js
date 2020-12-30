import { useState } from 'react';

import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';

const VISUALISATION_TYPE_LINE_CHART = 'line-chart';
const VISUALISATION_TYPE_WORD_CLOUD = 'word-cloud';

const useStyles = makeStyles(theme => ({
  formControl: {
    margin: theme.spacing(1),
    minWidth: 120,
  },
  selectEmpty: {
    marginTop: theme.spacing(2),
  },
}));

export default function NativeSelects() {
  const classes = useStyles();
  const [visualisationType, setVisualisationType] = useState('line-chart');
  const [isMentoringSession, setIsMentoringSession] = useState(false);

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="visualisation-type">
          Visualisation
        </InputLabel>
        <NativeSelect
          value={visualisationType}
          onChange={event => setVisualisationType(event.target.value)}
          inputProps={{ id: 'visualisation-type' }}>
          <option value={VISUALISATION_TYPE_LINE_CHART}>Line Chart</option>
          <option value={VISUALISATION_TYPE_WORD_CLOUD}>Word Cloud</option>
        </NativeSelect>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="is-mentoring-session">
          Mentoring
        </InputLabel>
        <NativeSelect
          value={isMentoringSession}
          onChange={event => setIsMentoringSession(event.target.value)}
          inputProps={{ id: 'is-mentoring-session' }}>
          <option value={false}>No</option>
          <option value={true}>Yes</option>
        </NativeSelect>
      </FormControl>
    </div>
  );
}
