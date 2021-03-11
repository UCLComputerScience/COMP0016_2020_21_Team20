import React from 'react';
import { Progress } from 'rsuite';

import PropTypes from 'prop-types';
import styles from './Circle.module.css';

const Circle = ({ id, name, color, percentage }) => {
  return (
    <div className={styles.circle}>
      <strong
        id={id + '%' + percentage.toString()}
        className={name.length > 10 ? styles.leftOffset : styles.rightOffset}>
        {name}
      </strong>
      <Progress.Circle percent={percentage} strokeColor={color} />
    </div>
  );
};

Circle.propTypes = {
  /** The HTML id for the element */
  id: PropTypes.string.isRequired,
  /** The label (e.g. Standard name) to show for this Circle */
  name: PropTypes.string.isRequired,
  /** The fill color of the circle */
  color: PropTypes.string.isRequired,
  /** The percentage of the circle to be filled in */
  percentage: PropTypes.number.isRequired,
  /** The id of the circle to be filled in */
  id: PropTypes.string.isRequired,
};

export default Circle;
