import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Fade from '@material-ui/core/Fade';

import { LineChart, Header, Accordion, Filter, Circle } from '../components';
//import Filters from '../../presentational/Utils/Filters';
//import { FiltersBuilderHelper } from '../../../helpers/filtersBuilder.helper';
import styles from './statistics.module.css';

const fetcher = (...args) => fetch(...args).then(res => res.json());

/** 
const [filterValues, setFilterValues] = useState({});

const LIVE_FILTERS_CONFIGURATION = new FiltersBuilderHelper()
  .addVisualisationFilter()
  .addDateRangeFilter();

useEffect(() => {
  if (Object.keys(filterValues).length === 0) return;
  fetchPage(
    page,
    Math.floor(
      (filterValues?.startDate ?? undefined
        ? new Date(filterValues.startDate)
        : new Date()
      ).getTime() / 1000
    ),
    Math.floor(
      (filterValues?.endDate ?? undefined
        ? new Date(filterValues.endDate)
        : new Date()
      ).getTime() / 1000
    ),
    filterValues?.countryFilters ?? undefined,
    filterValues?.genderFilter ?? undefined
  );
}, [page, filterValues]);
*/

function statistics(props) {
  const { data, error } = useSWR('/api/responses', fetcher);

  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header curPath="statistics" />
      <h1>Your Statistics</h1>

      <Accordion />

      <div className={styles.content}>
        <div className={styles.filters}>
          <Filter />
        </div>
        <div className={styles.graph}>
          <LineChart />
        </div>
      </div>
    </div>
  );
}

export default statistics;
