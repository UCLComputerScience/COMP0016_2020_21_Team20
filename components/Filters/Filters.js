import { useState } from 'react';

import Button from '@material-ui/core/Button';
import InputLabel from '@material-ui/core/InputLabel';
import FormControl from '@material-ui/core/FormControl';
import NativeSelect from '@material-ui/core/NativeSelect';
import { DateRange } from 'react-date-range';

import styles from './filters.module.css';
import 'react-date-range/dist/styles.css';
import 'react-date-range/dist/theme/default.css';

const VISUALISATION_TYPE_LINE_CHART = 'line-chart';
const VISUALISATION_TYPE_WORD_CLOUD = 'word-cloud';

export function Filter(props) {
  const [dateRange, setDateRange] = useState([
    { startDate: new Date(), endDate: null, key: 'selection' },
  ]);

  const [visualisationType, setVisualisationType] = useState('line-chart');
  const [isMentoringSession, setIsMentoringSession] = useState(false);

  console.log(dateRange);
  return (
    <div className={styles.content}>
      <div className={styles.title}>
        <h3>Filters:</h3>
      </div>

      <div className={styles.dateFilter}>
        <DateRange
          editableDateInputs={true}
          onChange={item => setDateRange([item.selection])}
          moveRangeOnFirstSelection={false}
          ranges={dateRange}
        />
      </div>

      <div className={styles.visualisationFilter}>
        <FormControl>
          <InputLabel shrink htmlFor="visualisation-type">
            Visualisation
          </InputLabel>
          <NativeSelect
            value={visualisationType}
            onChange={event => setVisualisationType(event.target.value)}
            inputProps={{ id: 'visualisation-type' }}>
            <option value={VISUALISATION_TYPE_LINE_CHART}>Line Chart</option>
            <option value={VISUALISATION_TYPE_WORD_CLOUD}>Word Cloud</option>
          </NativeSelect>
        </FormControl>

        <FormControl>
          <InputLabel shrink htmlFor="is-mentoring-session">
            Mentoring?
          </InputLabel>
          <NativeSelect
            value={isMentoringSession}
            onChange={event => setIsMentoringSession(event.target.value)}
            inputProps={{ id: 'is-mentoring-session' }}>
            <option value={false}>No</option>
            <option value={true}>Yes</option>
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

export default Filter;
