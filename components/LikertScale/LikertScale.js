import { useState } from 'react';
import {
  Radio,
  RadioGroup,
  FormControlLabel,
  FormControl,
} from '@material-ui/core';
import useMediaQuery from '@material-ui/core/useMediaQuery';

import styles from './LikertScale.module.css';

const options = {
  'Strongly Disagree (1)': 0,
  'Disagree (2)': 1,
  'Neutral (3)': 2,
  'Agree (4)': 3,
  'Strongly Agree (5)': 4,
};

function LikertScale(props) {
  const matches = useMediaQuery('(min-width:576px)');
  const [value, setValue] = useState(null);

  const updateValue = value => {
    setValue(value);
    props.onChange(value);
  };

  return (
    <FormControl className={styles.likertScaleWrapper}>
      <RadioGroup name={`likert-${props.questionId}`} value={value} row>
        {Object.entries(options).map(([text, score], i) => {
          return (
            <FormControlLabel
              key={i}
              className={styles.likertScale}
              value={score}
              label={text}
              onChange={() => updateValue(score)}
              labelPlacement={matches ? 'top' : 'start'}
              control={<Radio color="primary" />}
            />
          );
        })}
      </RadioGroup>
    </FormControl>
  );
}

export default LikertScale;
