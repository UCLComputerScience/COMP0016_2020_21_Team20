import React from 'react';
import { Loader, Message } from 'rsuite';
import ReactWordcloud from 'react-wordcloud';
import { Visualisations } from '../../lib/constants';
import PropTypes from 'prop-types';

import styles from './WordCloud.module.css';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

const options = {
  colors: [],
  enableTooltip: true,
  deterministic: true,
  fontFamily: 'impact',
  fontSizes: [30, 100],
  fontStyle: 'normal',
  fontWeight: 'normal',
  padding: 1,
  rotations: 0,
  rotationAngles: [0, 0],
  scale: 'log',
  spiral: 'archimedean',
  transitionDuration: 100,
};
function WordCloud(props) {
  //const standardData = Object.assign({}, options);
  //standardData.colors = [];
  //standardData.colors2 = [];

  if (props.words === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (props.words.length) {
    let questionId = 8;
    options.colors = ['#008000', '#00FA9A', '#2ca02c'];
    // We are hardcoding questionId = 8 as this corresponds to the 8th question in the self-report in which the user is asked to enter the enablers. Opposite for questionId = 9 (user enters barriers).
    if (props.visualisationType === Visualisations.WORD_CLOUD_BARRIERS) {
      questionId = 9;
      options.colors = ['#d62728', '#FF0000', '#B22222'];
    }
    const words = {};
    props.words.forEach(word => {
      if (word.question_id === questionId) {
        if (words[word.word]) {
          words[word.word].value++;
        } else {
          words[word.word] = { text: word.word, value: 1 };
        }
      }
    });

    return (
      <div style={{ height: 400, width: 600, margin: 'auto' }}>
        <ReactWordcloud words={Object.values(words)} options={options} />
      </div>
    );
  }

  return (
    <Message
      className={styles.message}
      type="info"
      title="No results found"
      description={
        <p>Please try setting a broader date range and/or filter.</p>
      }
    />
  );
}

WordCloud.propTypes = {
  /** a word that will be displayed in the wordcloud */
  word: PropTypes.string.isRequired,
  /** Visualisation type: enablers or barriers to display positive or negative words in the word cloud( from question 8 or question 9) */
  visualisationType: PropTypes.value,
};

export default WordCloud;
