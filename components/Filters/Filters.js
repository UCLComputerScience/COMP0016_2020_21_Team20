import { SelectPicker, DateRangePicker } from 'rsuite';
import { DateRange } from 'react-date-range';

import styles from './filters.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Visualisations } from '../../lib/constants';

const subtractDays = days => {
  const now = new Date().getTime();
  return new Date(now - days * 24 * 60 * 60 * 1000);
};

export function Filters(props) {
  return (
    <div className={styles.content}>
      <p>Date Range</p>
      <DateRangePicker
        showOneCalendar
        onChange={([start, end]) => props.setDateRange({ start, end })}
        value={[props.dateRange.start, props.dateRange.end]}
        isoWeek={true}
        cleanable={false}
        block={true}
        disabledDate={DateRangePicker.afterToday()}
        ranges={[
          { label: 'Last 7 days', value: [subtractDays(7), new Date()] },
          { label: 'Last 30 days', value: [subtractDays(30), new Date()] },
          { label: 'Last year', value: [subtractDays(365), new Date()] },
        ]}
      />

      <p>Visualisation</p>
      <SelectPicker
        value={props.visualisationType}
        onChange={value => props.setVisualisationType(value)}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          { label: 'Line Chart', value: Visualisations.LINE_CHART },
          { label: 'Word Cloud', value: Visualisations.WORD_CLOUD },
        ]}
      />

      <p>Mentoring?</p>
      <SelectPicker
        value={props.isMentoringSession ? '1' : '0'}
        onChange={value => props.setIsMentoringSession(value === '1')}
        searchable={false}
        placeholder="Select"
        cleanable={false}
        block={true}
        data={[
          { label: 'No', value: '0' },
          { label: 'Yes', value: '1' },
        ]}
      />
    </div>
  );
}

export default Filters;
