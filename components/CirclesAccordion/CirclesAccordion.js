import { Panel } from 'rsuite';
import styles from './CirclesAccordion.module.css';

import { Circle } from '..';

export default function CirclesAccordion(props) {
  return (
    <Panel
      className={styles.circles}
      header="Quick Summary"
      collapsible
      bordered
      shaded>
      <div className={styles.circlesWrapper}>
        {props.circles.map((c, i) => (
          <Circle
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
