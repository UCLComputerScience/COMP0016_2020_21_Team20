import React from 'react';
import { Loader, Message } from 'rsuite';
import ReactWordcloud from 'react-wordcloud';
import { Visualisations } from '../../lib/constants';

import styles from './WordCloud.module.css';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

/*
function getCallback(callback) {
  return function (word, event) {
    const isActive = callback !== 'onWordMouseOut';
    const element = event.target;
    const text = select(element);
    text
      .on('click', () => {
        if (isActive) {
          window.open(`https://dictionary.com/?q=${word.text}`, '_blank');
        }
      })
      .transition()
      .attr('background', 'white')
      .attr('font-size', isActive ? '300%' : '100%')
      .attr('text-decoration', isActive ? 'underline' : 'none');
  };
}

const callbacks = {
  getWordColor: word => (word.value > 50 ? 'orange' : 'purple'),
  getWordTooltip: word =>
    `The word "${word.text}" appears ${word.value} times.`,
  onWordClick: getCallback('onWordClick'),
  onWordMouseOut: getCallback('onWordMouseOut'),
  onWordMouseOver: getCallback('onWordMouseOver'),
};
*/

function WordCloud(props) {
  if (props.words === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (props.words.length) {
    let questionId = 8;
    if (props.visualisationType === Visualisations.WORD_CLOUD_BARRIERS) {
      questionId = 9;
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

    const options = {
      colors: [
        '#1f77b4',
        '#ff7f0e',
        '#2ca02c',
        '#d62728',
        '#9467bd',
        '#8c564b',
      ],
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

export default WordCloud;
