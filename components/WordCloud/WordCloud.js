import React from 'react';
import { Loader, Message } from 'rsuite';
import ReactWordcloud from 'react-wordcloud';

import styles from './WordCloud.module.css';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

function WordCloud(props) {
  if (props.words === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (data.length) {
    if (props.words.length) {
      const words = {};
      props.words.forEach(word => {
        if (words[word]) {
          words[word].value++;
        } else {
          words[word] = { text: word, value: 1 };
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
        deterministic: false,
        fontFamily: 'impact',
        fontSizes: [60, 200],
        fontStyle: 'normal',
        fontWeight: 'normal',
        padding: 1,
        rotations: 3,
        rotationAngles: [0, 0],
        scale: 'sqrt',
        spiral: 'archimedean',
        transitionDuration: 1000,
      };

      // TODO play around with the options for best UI
      return (
        <div style={{ height: 400, width: 600 }}>
          <ReactWordcloud words={Object.values(words)} options={options} />
        </div>
      );
    }
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
