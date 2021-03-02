import PropTypes from 'prop-types';
import styles from './LikertScaleQuestion.module.css';

import { LikertScale, Info } from '..';

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
        id={props.questionNumber.toString()}
        onChange={value => props.onChange(value)}
      />
    </div>
  );
}

LikertScaleQuestion.propTypes = {
  /** What function a likert scale click triggers */
  onChange: PropTypes.func.isRequired,
  /** The question number of the question */
  questionNumber: PropTypes.number.isRequired,
  /** The training url for the question */
  questionUrl: PropTypes.string.isRequired,
  /** The text of the question */
  question: PropTypes.string.isRequired,
  /** Whether to show the unanswered error text */
  showError: PropTypes.bool.isRequired,
};

export default LikertScaleQuestion;
