import { SelectPicker } from 'rsuite';
import { DateRange } from 'react-date-range';

import styles from './filters.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Visualisations } from '../../lib/constants';

export function Filters(props) {
  return (
    <div className={styles.content}>
      <DateRange
        editableDateInputs={true}
        onChange={item =>
          props.setDateRange({
            start: item.selection.startDate,
            end: item.selection.endDate,
          })
        }
        moveRangeOnFirstSelection={false}
        ranges={[
          {
            startDate: props.dateRange.start,
            endDate: props.dateRange.end,
            key: 'selection',
          },
        ]}
      />

      <div>
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
    </div>
  );
}

export default Filters;
