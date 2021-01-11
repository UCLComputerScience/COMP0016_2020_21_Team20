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

    // TODO play around with the options for best UI
    return (
      <ReactWordcloud
        words={Object.values(words)}
        options={{
          fontSizes: [20, 50],
          rotationAngles: [0, 50],
          deterministic: true,
        }}
      />
    );
  }

  // TODO better UI for fetching data/no results found
  return <p>No Results Found...</p>;
}

export default WordCloud;
