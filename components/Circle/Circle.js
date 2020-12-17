import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import styles from './circle.module.css';
import colors from '../../lib/colors';

const getData = props => {
  const number = Math.floor(Math.random() * 100);
  return {
    datasets: [
      {
        data: [number, 100 - number],
        backgroundColor: [props.color, 'rgb(220,220,220,0.8)'],
        hoverBackgroundColor: [props.color, 'rgb(220,220,220,0.8)'],
      },
    ],
  };
};

export default props => (
  <div>
    <h2>{props.name}</h2>
    <Doughnut
      data={getData(props)}
      width={'200'}
      height={'200'}
      options={{ cutoutPercentage: 65 }}
    />
  </div>
);
