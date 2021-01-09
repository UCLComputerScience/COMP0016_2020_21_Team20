import React from 'react';

import styles from './Circle.module.css';

const circleConfig = {
  viewBox: '0 0 40 40',
  x: '20',
  y: '20',
  radio: '15.91549430918954',
};

// TODO make this responsive for tablet-sizes and lower (somehow...)
// Basic implementation from https://dev.to/dastasoft/animated-circle-progress-bar-with-svg-as-react-component-28nm
const Circle = ({ name, color, percentage }) => {
  return (
    <div className={styles.circle}>
      <h3 className={name.length > 10 ? styles.leftOffset : styles.rightOffset}>
        {name}
      </h3>
      <svg viewBox={circleConfig.viewBox}>
        <circle
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          fill="transparent"
          stroke="rgb(220,220,220,0.8)"
        />

        <circle
          cx={circleConfig.x}
          cy={circleConfig.y}
          r={circleConfig.radio}
          fill="transparent"
          stroke={color}
          strokeDasharray={`${percentage} ${100 - percentage}`}
          strokeDashoffset={25}
        />
        <g className={styles.circleLabel}>
          <text x="50%" y="50%" className={styles.percentage}>
            {percentage}%
          </text>
        </g>
      </svg>
    </div>
  );
};

export default Circle;
