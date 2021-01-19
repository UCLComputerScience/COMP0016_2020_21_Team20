import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader, Message } from 'rsuite';

import styles from './linechart.module.css';

const baseProperties = {
  fill: false,
  lineTension: 0.1,
  pointBackgroundColor: '#fff',
  pointBorderWidth: 5,
  label: '',
  // data, label, borderColor remaining
};

// TODO clean up this logic
const formatData = data => {
  const formattedData = {
    labels: data.map(d => d.timestamp),
    datasets: [],
  };

  console.log('test', data[0]);
  if (data[0].is_mentoring_session === true) {
    baseProperties.pointBackgroundColor = 'red';
    baseProperties.pointBorderWidth = 10;
    baseProperties.pointBorderWidth = 'Mentoring Session';
  } else {
    baseProperties.pointBackgroundColor = '#fff';
    baseProperties.pointBorderWidth = 5;
    baseProperties.pointBorderWidth = ' ';
  }

  const numberOfStandards = data[0].scores.length;
  for (let i = 0; i < numberOfStandards; i++) {
    const thisStandardData = data.map(d => d.scores[i]);
    const standardData = Object.assign({}, baseProperties);
    standardData.borderColor = thisStandardData[0].color;
    standardData.label = thisStandardData[0].standardName;
    standardData.data = thisStandardData.map(s => (s.score / 4) * 100);
    formattedData.datasets.push(standardData);
  }

  return formattedData;
};

function LineChart({ data } = {}) {
  if (data === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (data.length) {
    return (
      <div>
        <h2 className={styles.title}>Self-reporting over time</h2>
        <Line data={formatData(data)} />
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

export default LineChart;
