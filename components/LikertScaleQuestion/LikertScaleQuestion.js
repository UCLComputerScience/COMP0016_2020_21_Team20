import { LikertScale, Info } from '..';

import styles from './LikertScaleQuestion.module.css';

function LikertScaleQuestion(props) {
  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        {props.questionNumber}. {props.question}
        <Info url={props.questionUrl} />
      </div>

      {props.showError && (
        <div className={styles.unAnsweredAlert}>*please choose an answer</div>
      )}

      <LikertScale
        onChange={value => props.onChange(value)}
        questionId={props.questionId}
      />
    </div>
  );
}

export default LikertScaleQuestion;
