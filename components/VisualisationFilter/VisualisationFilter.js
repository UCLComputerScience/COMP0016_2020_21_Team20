import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import InputLabel from '@material-ui/core/InputLabel';
import FormHelperText from '@material-ui/core/FormHelperText';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import NativeSelect from '@material-ui/core/NativeSelect';

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
  const [state, setState] = React.useState({
    visualisation: '',
    visualisationType: '',
  });

  const handleChange = event => {
    const visualisationType = event.target.visualisationType;
    setState({
      ...state,
      [visualisationType]: event.target.value,
    });
  };

  return (
    <div>
      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="visualisation-native-label-placeholder">
          Visualisation
        </InputLabel>
        <NativeSelect
          value={state.visualisation}
          onChange={handleChange}
          inputProps={{
            visualisationType: 'visualisation',
            id: 'visualisation-native-label-placeholder',
          }}>
          <option value="">Line Chart</option>
          <option value={10}>Pie Chart</option>
        </NativeSelect>
        <FormHelperText></FormHelperText>
      </FormControl>

      <FormControl className={classes.formControl}>
        <InputLabel shrink htmlFor="visualisation-native-label-placeholder">
          Mentoring
        </InputLabel>
        <NativeSelect
          value={state.visualisation}
          onChange={handleChange}
          inputProps={{
            visualisationType: 'visualisation',
            id: 'visualisation-native-label-placeholder',
          }}>
          <option value="">No</option>
          <option value={10}>Yes</option>
        </NativeSelect>
        <FormHelperText></FormHelperText>
      </FormControl>
    </div>
  );
}
