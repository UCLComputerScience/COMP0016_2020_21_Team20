import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader, Message } from 'rsuite';

import styles from './linechart.module.css';

const MENTORING_SESSSION_POINT_COLOR = 'grey';

const baseProperties = {
  fill: false,
  lineTension: 0.1,
  pointBackgroundColor: '#fff',
  // data, label, borderColor remaining
};

// TODO clean up this logic
const formatData = data => {
  const formattedData = {
    labels: data.map(d => new Date(d.timestamp).toDateString()),
    datasets: [],
  };

  const numberOfStandards = data[0].scores.length;
  for (let i = 0; i < numberOfStandards; i++) {
    const thisStandardData = data.map(d => d.scores[i]);
    const standardData = Object.assign({}, baseProperties);
    standardData.borderColor = thisStandardData[0].color;
    standardData.label = thisStandardData[0].standardName;

    // Change color with mentoring session
    const isMentoringSessions = data.map(d => d.is_mentoring_session);
    standardData.pointBackgroundColor = [];
    standardData.pointBorderColor = [];
    standardData.pointBorderWidth = [];
    isMentoringSessions.forEach(isMentoringSession => {
      if (isMentoringSession) {
        standardData.pointBackgroundColor.push(MENTORING_SESSSION_POINT_COLOR);
        standardData.pointBorderColor.push(MENTORING_SESSSION_POINT_COLOR);
        standardData.pointBorderWidth.push(6);
      } else {
        standardData.pointBackgroundColor.push('white');
        standardData.pointBorderColor.push(thisStandardData[0].color);
        standardData.pointBorderWidth.push(2);
      }
    });
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
      <>
        <h2 className={styles.title}>Self-reporting over time</h2>
        <Line
          data={formatData(data)}
          options={{
            tooltips: {
              callbacks: {
                title: tooltip => new Date(tooltip[0].label).toDateString(),
                afterTitle: (tooltip, data) =>
                  data.datasets[tooltip[0].datasetIndex].pointBackgroundColor[
                    tooltip[0].index
                  ] === MENTORING_SESSSION_POINT_COLOR && 'Mentoring session',
                labelColor: (tooltip, data) => {
                  return {
                    borderColor:
                      data.legend.legendItems[tooltip.datasetIndex].fillStyle,
                    backgroundColor:
                      data.legend.legendItems[tooltip.datasetIndex].fillStyle,
                  };
                },
              },
            },
            scales: {
              xAxes: [{ ticks: { maxRotation: 0 } }],
            },
          }}
        />
      </>
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
