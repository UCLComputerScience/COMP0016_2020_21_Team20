import React from 'react';
import { Line } from 'react-chartjs-2';

const data = {
  labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
  datasets: [
    {
      label: 'Timely',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(26,113,192,0.4)',
      borderColor: 'rgba(26,113,192,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(26,113,192,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(75,192,192,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [20, 20, 50, 70, 90, 50, 100],
    },
    {
      label: 'Dignified',
      fill: false,
      lineTension: 0.1,
      backgroundColor: 'rgba(247,151,51,0.4)',
      borderColor: 'rgba(247,151,51,1)',
      borderCapStyle: 'butt',
      borderDash: [],
      borderDashOffset: 0.0,
      borderJoinStyle: 'miter',
      pointBorderColor: 'rgba(247,151,51,1)',
      pointBackgroundColor: '#fff',
      pointBorderWidth: 1,
      pointHoverRadius: 5,
      pointHoverBackgroundColor: 'rgba(247,151,51,1)',
      pointHoverBorderColor: 'rgba(220,220,220,1)',
      pointHoverBorderWidth: 2,
      pointRadius: 1,
      pointHitRadius: 10,
      data: [10, 50, 50, 50, 70, 90, 82],
    },
  ],
};

export default () => (
  <div>
    <h2>Compliance over time</h2>
    <Line data={data} />
  </div>
);
