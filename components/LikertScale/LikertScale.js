import { useState } from 'react';
import { Radio, RadioGroup } from 'rsuite';

import styles from './LikertScale.module.css';

const options = {
  'Strongly Disagree (1)': 0,
  'Disagree (2)': 1,
  'Neutral (3)': 2,
  'Agree (4)': 3,
  'Strongly Agree (5)': 4,
};

function LikertScale(props) {
  const [value, setValue] = useState(null);

  const updateValue = value => {
    setValue(value);
    props.onChange(value);
  };

  return (
    <RadioGroup
      className={styles.likertScaleWrapper}
      value={value}
      inline
      onChange={score => updateValue(score)}
      appearance="picker">
      {Object.entries(options).map(([text, score], i) => {
        return (
          <Radio
            inline
            key={i}
            className={styles.likertScale}
            value={score}
            title={text}>
            {text}
          </Radio>
        );
      })}
    </RadioGroup>
  );
}

export default LikertScale;
