import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

function WordCloud(props) {
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

  // TODO better UI for fetching data/no results found
  return <p>No Results Found...</p>;
}

export default WordCloud;
