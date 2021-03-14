import { useEffect, useState } from 'react';
import { AutoComplete } from 'rsuite';

import PropTypes from 'prop-types';
import styles from './WordsQuestion.module.css';

const MAX_NUMBER_OF_WORDS = 3;

function WordsQuestion(props) {
  const [word1, setWord1] = useState(null);
  const [word2, setWord2] = useState(null);
  const [word3, setWord3] = useState(null);

  const generateInputs = () => {
    const inputs = [];
    for (let i = 0; i < MAX_NUMBER_OF_WORDS; i++) {
      let setter;
      if (i === 0) setter = setWord1;
      else if (i === 1) setter = setWord2;
      else if (i === 2) setter = setWord3;

      inputs.push(
        <div>
          <AutoComplete
            id={'wq' + props.questionNumber.toString() + 'i' + i.toString()}
            data={props.suggestedWords}
            size="lg"
            className={styles.input}
            key={i}
            onChange={value => setter(value)}
          />
          <label
            className={styles.hidden}
            for={'wq' + props.questionNumber.toString() + 'i' + i.toString()}>
            {'Enter a word (optional)'}
          </label>
        </div>
      );
    }
    return inputs;
  };

  // Notify the parent whenever state changes
  useEffect(() => {
    props.onChange([word1, word2, word3]);
  });

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        {props.questionNumber}. {props.question}
      </div>
      <div className={styles.italicText}>
        (response is not required, you may provide none or up to 3 words that
        you feel are suitable)
      </div>
      <div className={styles.wordsInputContainer}>{generateInputs()}</div>
    </div>
  );
}

WordsQuestion.propTypes = {
  /** What function is triggered by changes in the input boxes */
  onChange: PropTypes.func.isRequired,
  /** The question number of the question */
  questionNumber: PropTypes.number.isRequired,
  /** The text of the question */
  question: PropTypes.string.isRequired,
  /** Array of suggested words to show when writing in input boxes */
  suggestedWords: PropTypes.array.isRequired,
};

export default WordsQuestion;
