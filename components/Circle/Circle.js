import React from 'react';
import { Progress } from 'rsuite';

import PropTypes from 'prop-types';
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

Circle.propTypes = {
  /** The label (e.g. Standard name) to show for this Circle */
  name: PropTypes.string.isRequired,
  /** The fill color of the circle */
  color: PropTypes.string.isRequired,
  /** The percentage of the circle to be filled in */
  percentage: PropTypes.number.isRequired,
};

export default Circle;
