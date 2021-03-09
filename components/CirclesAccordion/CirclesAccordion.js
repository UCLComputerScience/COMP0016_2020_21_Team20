import { Panel } from 'rsuite';
import styles from './CirclesAccordion.module.css';
import PropTypes from 'prop-types';

import { Circle } from '..';

export default function CirclesAccordion(props) {
  return (
    <Panel
      className={styles.circles}
      header={<text id="summary">Quick Summary</text>}
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
  /** Object containg array that describes the circles to be displayed, containing the name, colour and percentage of each circle*/
  circles: PropTypes.array.isRequired,
};
