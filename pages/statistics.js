import { useEffect, useState } from 'react';
import useSWR from 'swr';
import Fade from '@material-ui/core/Fade';

import { LineChart, Header, Accordion, Filter, Circle } from '../components';
//import Filters from '../../presentational/Utils/Filters';
//import { FiltersBuilderHelper } from '../../../helpers/filtersBuilder.helper';

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

const circles = [
  {
    question: 'Timely Care',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
  {
    question:
      'Provide 3 words that describe enablers/facilitators to providing high quality effective care in this interaction.',
    questionId: 8,
  },
  {
    question:
      'Provide 3 words that describe barriers/challenges to providing high quality effective care in this interaction.',
    questionId: 9,
  },
];

function statistics(props) {
  const { data, error } = useSWR('/api/responses', fetcher);

  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header curPath="statistics" />
      <h1>Statistics</h1>

      {circles.map((question, i) => (
        <Accordion
          key={i}
          question={question.question}
          questionId={question.questionId}
          questionNumber={i + 8}
          onChange={words => (question.words = words)}
        />
      ))}

      <Filter />
      <LineChart />
    </div>
  );
}

export default statistics;
