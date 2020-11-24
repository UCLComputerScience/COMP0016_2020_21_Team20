import { useState } from 'react';

import { LikertScale, Info } from '../';

import styles from './Question.module.css';

function Question(props) {
  const [score, setScore] = useState(null);

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        {props.questionNumber}. {props.question}
      </div>
      <Info url={props.questionUrl} />
      <LikertScale
        onChange={value => setScore(value)}
        questionId={props.questionId}
      />
    </div>
  );
}

export default Question;
