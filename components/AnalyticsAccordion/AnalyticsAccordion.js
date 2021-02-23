import { Panel, Message } from 'rsuite';
import styles from './AnalyticsAccordion.module.css';
import PropTypes from 'prop-types';

export default function AnalyticsAccordion(props) {
  const lastWeek = new Date();
  //currently cheking if done in the past week, to change to for example past month change 7*24 to 30*24
  lastWeek.setHours(lastWeek.getHours() - 7 * 24);
  const showNotDone =
    props.data &&
    props.data.filter(d => lastWeek < new Date(d.timestamp)).length === 0;

  const good =
    props.stats &&
    props.stats.filter(s => s.percentage >= 75).map(s => s.longName);
  const goodWord =
    good && good.length === 0 ? ' this standard' : ' these standards';

  const neutral =
    props.stats &&
    props.stats
      .filter(s => s.percentage < 75 && s.percentage > 25)
      .map(s => s.longName);

  const bad =
    props.stats &&
    props.stats.filter(s => s.percentage <= 25).map(s => s.longName);

  return (
    <Panel
      className={styles.analytics}
      header="Personal Analytics"
      collapsible
      bordered
      shaded>
      <div>
        {(showNotDone || !props.data) && (
          <Message
            showIcon
            type="info"
            description="You have not completed a self-report in the last week."
          />
        )}
      </div>
      <div className={styles.spacing}>
        {good && good.length !== 0 && (
          <Message
            type="success"
            description={
              <text>
                It looks like you are happy that a satisfactory standard has
                been achieved for:{' '}
                <text style={{ fontWeight: 'bold' }}>{good.join(', ')}</text>.
                Well done! You are hitting the target for{goodWord}. You can
                help your colleagues regarding{goodWord}
                {'.'}
              </text>
            }
          />
        )}
      </div>
      <div className={styles.spacing}>
        {neutral && neutral.length !== 0 && (
          <Message
            type="warning"
            description={
              <text>
                It looks like there is an opportunity to improve confidence in
                meeting:{' '}
                <text style={{ fontWeight: 'bold' }}>{neutral.join(', ')}</text>
                . You may wish to follow the i link (next to each respective
                question) to resources that you may find helpful.
              </text>
            }
          />
        )}
      </div>
      <div className={styles.spacing}>
        {bad && bad.length !== 0 && (
          <Message
            type="error"
            description={
              <text>
                It looks like you are not happy that a satisfactory standard has
                been achieved for:{' '}
                <text style={{ fontWeight: 'bold' }}>{bad.join(', ')}</text>.
                You are strongly advised to further discuss this case with a
                mentor or colleague to establish what further steps may need to
                be taken to address this.
              </text>
            }
          />
        )}
      </div>
    </Panel>
  );
}

AnalyticsAccordion.propTypes = {
  /** Array containing the dates of previous self reports*/
  data: PropTypes.array,
  /** Array containing the 'percentage' and 'longName' of each standard*/
  stats: PropTypes.array,
};
