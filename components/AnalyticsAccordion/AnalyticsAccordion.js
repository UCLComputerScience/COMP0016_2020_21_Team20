import { Panel, Message } from 'rsuite';
import styles from './AnalyticsAccordion.module.css';
import PropTypes from 'prop-types';

// Threshold (hours) for when to alert a user they haven't completed a self-report
const LAST_SELF_REPORT_CHECK_PERIOD_HOURS = 7 * 24;

export default function AnalyticsAccordion(props) {
  const lastWeek = new Date();
  lastWeek.setHours(lastWeek.getHours() - LAST_SELF_REPORT_CHECK_PERIOD_HOURS);

  const showNotDone =
    !props.data ||
    !props.data.filter(d => lastWeek < new Date(d.timestamp)).length;

  const goodStandardNames = props.stats
    ? props.stats.filter(s => s.percentage >= 75).map(s => s.longName)
    : [];

  const goodWord =
    goodStandardNames.length === 1 ? 'this standard' : 'these standards';

  const neutralStandardNames = props.stats
    ? props.stats
        .filter(s => s.percentage < 75 && s.percentage > 25)
        .map(s => s.longName)
    : [];

  const badStandardNames = props.stats
    ? props.stats.filter(s => s.percentage <= 25).map(s => s.longName)
    : [];

  return (
    <Panel
      aria-label="Personal Analytics"
      className={styles.analytics}
      header={<text id="analytics">Personal Analytics</text>}
      collapsible
      bordered
      shaded>
      {showNotDone && (
        <Message
          showIcon
          type="info"
          description="You have not completed a self-report in the last week."
        />
      )}

      {goodStandardNames.length !== 0 && (
        <Message
          className={styles.spacing}
          type="success"
          description={
            <text id="good">
              It looks like you are happy that a satisfactory standard has been
              achieved for:{' '}
              <text style={{ fontWeight: 'bold' }}>
                {goodStandardNames.join(', ')}
              </text>
              . Well done! You are hitting the target for {goodWord}. You can
              help your colleagues regarding {goodWord}.
            </text>
          }
        />
      )}

      {neutralStandardNames.length !== 0 && (
        <Message
          className={styles.spacing}
          type="warning"
          description={
            <text id="neutral">
              It looks like there is an opportunity to improve confidence in
              meeting:{' '}
              <text style={{ fontWeight: 'bold' }}>
                {neutralStandardNames.join(', ')}
              </text>
              . You may wish to follow the <i>i</i> link (next to each
              respective question) to resources that you may find helpful.
            </text>
          }
        />
      )}

      {badStandardNames.length !== 0 && (
        <Message
          className={styles.spacing}
          type="error"
          description={
            <text id="bad">
              It looks like you are not happy that a satisfactory standard has
              been achieved for:{' '}
              <text style={{ fontWeight: 'bold' }}>
                {badStandardNames.join(', ')}
              </text>
              . You are strongly advised to further discuss this case with a
              mentor or colleague to establish what further steps may need to be
              taken to address this.
            </text>
          }
        />
      )}
    </Panel>
  );
}

AnalyticsAccordion.propTypes = {
  /** Array containing the dates of previous self reports*/
  data: PropTypes.array,
  /** Array containing the 'percentage' and 'longName' of each standard*/
  stats: PropTypes.array,
};
