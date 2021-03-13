import { Panel } from 'rsuite';
import styles from './CirclesAccordion.module.css';
import PropTypes from 'prop-types';

import { Circle } from '..';

export default function CirclesAccordion(props) {
  return (
    <Panel
      aria-label="quickSummary"
      className={styles.circles}
      header={
        <text aria-label="quickSummary" id="summary">
          Quick Summary
        </text>
      }
      collapsible
      bordered
      shaded>
      <div className={styles.circlesWrapper}>
        {props.circles.map((c, i) => (
          <Circle
            id={'c' + i.toString()}
            key={i}
            name={c.name}
            color={c.color}
            percentage={c.percentage}
          />
        ))}
      </div>
    </Panel>
  );
}

CirclesAccordion.propTypes = {
  /** Array of objects for each circle to be displayed, with properties: `name`, `color`, and `percentage` for each circle */
  circles: PropTypes.array.isRequired,
};
