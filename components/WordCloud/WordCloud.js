import React from 'react';
import ReactWordcloud from 'react-wordcloud';

import 'tippy.js/dist/tippy.css';
import 'tippy.js/animations/scale.css';

function WordCloud(data) {
  // Supprimer à partir de là
  data = {
    data: [
      {
        words: {
          create: [
            { word: 'Hello', standars: { connect: { id: 8 } } },
            { word: 'Hola', standars: { connect: { id: 8 } } },
            { word: 'Bonjour', standars: { connect: { id: 8 } } },
            { word: 'Toto', standars: { connect: { id: 9 } } },
            { word: 'Michele', standars: { connect: { id: 9 } } },
            { word: 'Paul', standars: { connect: { id: 9 } } },
          ],
        },
      },
      {
        words: {
          create: [
            { word: 'Hello', standars: { connect: { id: 8 } } },
            { word: 'Hola', standars: { connect: { id: 8 } } },
            { word: 'Bonjour', standars: { connect: { id: 8 } } },
            { word: 'Toto', standars: { connect: { id: 9 } } },
            { word: 'Michele', standars: { connect: { id: 9 } } },
            { word: 'Paul', standars: { connect: { id: 9 } } },
          ],
        },
      },
      {
        words: {
          create: [
            { word: 'Hello', standars: { connect: { id: 8 } } },
            { word: 'Hola', standars: { connect: { id: 8 } } },
            { word: 'Bonjour', standars: { connect: { id: 8 } } },
            { word: 'Toto', standars: { connect: { id: 9 } } },
            { word: 'Michele', standars: { connect: { id: 9 } } },
            { word: 'Paul', standars: { connect: { id: 9 } } },
          ],
        },
      },
    ],
  };
  // console.log(data);
  if (data.data) {
    const words = [];
    data.data.forEach(data1 => {
      data1.words.create.forEach(word => {
        // console.log(word.word);
        words.push({
          text: word.word,
          value: 10000,
        });
      });
    });
    console.log(words);
    //return <p>{data.responses[0].words.state8[0]}</p>;
    return <ReactWordcloud words={words} />;
  }

  // TODO better UI for fetching data/no results found
  return <p>No Results Found...</p>;
}

export default WordCloud;
