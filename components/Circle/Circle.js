import React from 'react';
import { Progress } from 'rsuite';

import styles from './Circle.module.css';

const { Circle: CircleComponent } = Progress;

const Circle = ({ name, color, percentage }) => {
  return (
    <div className={styles.circle}>
      <strong
        className={name.length > 10 ? styles.leftOffset : styles.rightOffset}>
        {name}
      </strong>
      <CircleComponent percent={percentage} strokeColor={color} />
    </div>
  );
};

export default Circle;
