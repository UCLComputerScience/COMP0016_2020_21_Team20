import { useState } from 'react';

import { Input } from '@material-ui/core';

import styles from './WordsQuestion.module.css';

const MAX_NUMBER_OF_WORDS = 3;

function generateInputs() {
  const inputs = [];
  for (let i = 0; i < MAX_NUMBER_OF_WORDS; i++) {
    inputs.push(<Input />);
  }
  return inputs;
}

function WordsQuestion(props) {
  const [words, setWords] = useState([]);

  const updateWords = word => {
    setWords(words.concat(word));
    props.onChange(words);
  };

  return (
    <div className={styles.question}>
      <div className={styles.questionText}>
        {props.questionNumber}. {props.question}
      </div>
      {generateInputs()}
    </div>
  );
}

export default WordsQuestion;
