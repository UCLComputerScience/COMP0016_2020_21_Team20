import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from './linechart.module.css';

const baseProperties = {
  fill: false,
  lineTension: 0.1,
  pointBackgroundColor: '#fff',
  // data, label, borderColor remaining
};

// TODO clean up this logic
const formatData = data => {
  const formattedData = {
    labels: data.map(d => d.timestamp),
    datasets: [],
  };

  const numberOfStandards = data[0].scores.length;
  for (let i = 0; i < numberOfStandards; i++) {
    const thisStandardData = data.map(d => d.scores[i]);
    const standardData = Object.assign({}, baseProperties);
    standardData.borderColor = thisStandardData[0].color;
    standardData.label = thisStandardData[0].standardName;
    standardData.data = thisStandardData.map(s => s.score);
    formattedData.datasets.push(standardData);
  }

  return formattedData;
};

function LineChart({ data } = {}) {
  if (data.length) {
    return (
      <div>
        <h2 className={styles.title}>Compliance over time</h2>
        <Line data={formatData(data)} />
      </div>
    );
  }

  // TODO better UI for fetching data/no results found
  return <p>Fetching...</p>;
}

export default LineChart;
