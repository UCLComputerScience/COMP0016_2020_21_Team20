import { useState } from 'react';

import { LikertScale, Info } from '..';

import styles from './LikertScaleQuestion.module.css';

function LikertScaleQuestion(props) {
  const [value, setValue] = useState(null);

  const updateValue = value => {
    setValue(value);
    props.onChange(value);
  };

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        {props.questionNumber}. {props.question}
      </div>

      {props.showError && (
        <div className={styles.unAnsweredAlert}>*please choose an answer</div>
      )}

      <Info url={props.questionUrl} />
      <LikertScale
        onChange={value => updateValue(value)}
        questionId={props.questionId}
      />
    </div>
  );
}

export default LikertScaleQuestion;
