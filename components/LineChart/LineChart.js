import React from 'react';
import { Line } from 'react-chartjs-2';
import styles from './linechart.module.css';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Timely',
      fill: false,
      lineTension: 0.1,
      borderColor: 'rgba(26,113,192,1)',
      pointBackgroundColor: '#fff',
      data: [20, 20, 50, 70, 90, 50, 100],
    },
    {
      label: 'Dignified',
      fill: false,
      lineTension: 0.1,
      borderColor: 'rgba(247,151,51,1)',
      pointBackgroundColor: '#fff',
      data: [10, 50, 50, 50, 70, 90, 82],
    },
  ],
};

export default () => (
  <div>
    <h2 className={styles.title}>Compliance over time</h2>
    <Line data={data} />
  </div>
);
