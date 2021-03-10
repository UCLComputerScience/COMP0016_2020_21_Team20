import React from 'react';
import { Line } from 'react-chartjs-2';
import { Loader, Message } from 'rsuite';
import PropTypes from 'prop-types';

import styles from './linechart.module.css';

const MENTORING_SESSION_POINT_COLOR = 'red';

const baseProperties = {
  fill: false,
  lineTension: 0.1,
  pointBackgroundColor: '#fff',
  // data, label, borderColor, etc. remaining
};

let numberOfStandards = 0;

/**
 * Chart.js requires a specific format to render the graph. This function simply transforms
 * the data from the API into the correct format required by Chart.js. For reference, the
 * expected format is:
 * {
 *  labels: ['Label 1', 'Label 2', ...],
 *  datasets: [
 *    {
 *      fill: false,
 *      lineTension: 0.1,
 *      pointBackgroundColor: ['color for data point 1', 'color for data point 2', ...],
 *      borderColor: ['color for data point 1', 'color for data point 2', ...],
 *      data: [80, 40, ...],
 *      label: 'Label 1',
 *      ...
 *    }
 *  ]
 * }
 */
const formatData = data => {
  const formattedData = {
    labels: data.map(d => new Date(d.timestamp)),
    datasets: [],
  };

  numberOfStandards = data[0].scores.length;
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
    standardData.pointStyle = [];
    isMentoringSessions.forEach(isMentoringSession => {
      if (isMentoringSession) {
        standardData.pointBackgroundColor.push(MENTORING_SESSION_POINT_COLOR);
        standardData.pointBorderColor.push(MENTORING_SESSION_POINT_COLOR);
        standardData.pointStyle.push('triangle');
        standardData.pointBorderWidth.push(4);
      } else {
        standardData.pointBackgroundColor.push('white');
        standardData.pointBorderColor.push(thisStandardData[0].color);
        standardData.pointBorderWidth.push(2);
        standardData.pointStyle.push('circle');
      }
    });
    standardData.data = thisStandardData.map(s => (s.score / 4) * 100);
    formattedData.datasets.push(standardData);
  }

  // Append a dummy legend button 'invert selection', handled in the legend click handler
  formattedData.datasets.push({ label: 'Invert selection' });

  return formattedData;
};

/**
 * Handle the 'invert selection' dummy legend item that is appended to the legend
 */
const legendClickHandler = function (e, legendItem) {
  const chart = this.chart;

  // If not invert selection label, then do default
  if (legendItem.datasetIndex !== numberOfStandards) {
    const index = legendItem.datasetIndex;
    const meta = chart.getDatasetMeta(index);

    meta.hidden =
      meta.hidden === null ? !chart.data.datasets[index].hidden : null;
  } else {
    // If invert selection label, then invert if hidden or not
    for (let i = 0; i < numberOfStandards; i++) {
      const meta = chart.getDatasetMeta(i);
      meta.hidden =
        meta.hidden === null ? !chart.data.datasets[i].hidden : null;
    }
  }

  chart.update();
};

function LineChart({ data } = {}) {
  const isDarkTheme = () => {
    if (typeof document === 'undefined') return false;
    return document.body.dataset.theme === 'dark';
  };

  if (data === null) {
    return (
      <Loader className={styles.loading} size="lg" content="Loading data..." />
    );
  } else if (data.length) {
    return (
      <>
        <h2 className={styles.title}>Self-reporting over time</h2>
        <p className={styles.legend}>
          Click on the legend to toggle the standards.
        </p>
        <Line
          data={formatData(data)}
          options={{
            tooltips: {
              callbacks: {
                title: tooltip => new Date(tooltip[0].label).toDateString(),
                afterTitle: (tooltip, data) =>
                  data.datasets[tooltip[0].datasetIndex].pointBackgroundColor[
                    tooltip[0].index
                  ] === MENTORING_SESSION_POINT_COLOR && 'Mentoring session',
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
              xAxes: [
                {
                  ticks: { maxRotation: 0, fontColor: 'darkgray' },
                  type: 'time',
                  time: { unit: 'day' },
                  gridLines: {
                    color: isDarkTheme()
                      ? 'rgba(220, 220, 220, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                },
              ],
              yAxes: [
                {
                  ticks: { fontColor: 'darkgray' },
                  gridLines: {
                    color: isDarkTheme()
                      ? 'rgba(220, 220, 220, 0.1)'
                      : 'rgba(0, 0, 0, 0.1)',
                  },
                },
              ],
            },
            legend: {
              labels: { fontColor: isDarkTheme() ? '#9C9C9D' : '#666' },
              onClick: legendClickHandler, // To add 'invert selection' option to legend
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

LineChart.propTypes = {
  /** Array containing objects consisting of: isMentoringSession, scores array and timestamp */
  data: PropTypes.array,
};

export default LineChart;
