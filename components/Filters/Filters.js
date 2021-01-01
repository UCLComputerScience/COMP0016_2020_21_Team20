import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { DateRange } from 'react-date-range';

import styles from './filters.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

import { Visualisations } from '../../lib/constants';

export function Filters(props) {
  return (
    <div className={styles.content}>
      <div>
        <h3>Filters:</h3>
      </div>

      <div>
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
      </div>

      <div className={styles.dropdownFilters}>
        <FormControl>
          <InputLabel shrink htmlFor="visualisation-type">
            Visualisation
          </InputLabel>
          <NativeSelect
            value={props.visualisationType}
            onChange={event => props.setVisualisationType(event.target.value)}
            inputProps={{ id: 'visualisation-type' }}>
            <option value={Visualisations.LINE_CHART}>Line Chart</option>
            <option value={Visualisations.WORD_CLOUD}>Word Cloud</option>
          </NativeSelect>
        </FormControl>

        <FormControl>
          <InputLabel shrink htmlFor="is-mentoring-session">
            Mentoring?
          </InputLabel>
          <NativeSelect
            value={props.isMentoringSession ? '1' : '0'}
            onChange={event =>
              props.setIsMentoringSession(event.target.value === '1')
            }
            inputProps={{ id: 'is-mentoring-session' }}>
            <option value={'0'}>No</option>
            <option value={'1'}>Yes</option>
          </NativeSelect>
        </FormControl>
      </div>

      <div className={styles.button}>
        <Button variant="contained" color="secondary">
          Apply Filters
        </Button>
      </div>
    </div>
  );
}

export default Filters;
