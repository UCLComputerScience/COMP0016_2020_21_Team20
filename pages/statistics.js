import querystring from 'querystring';
import { useState } from 'react';
import { useSession } from 'next-auth/client';

import styles from './statistics.module.css';

import {
  LineChart,
  Header,
  CirclesAccordion,
  Filters,
  LoginMessage,
  WordCloud,
} from '../components';

import useSWR from '../lib/swr';
import { StandardColors, Visualisations } from '../lib/constants';
import colors from '../lib/colors';

const DEFAULT_DATE_OFFSET = 60 * 60 * 24 * 30 * 1000; // 30 days ago;

const generateQueryParams = ({
  start = new Date().getTime() - DEFAULT_DATE_OFFSET,
  end = new Date().getTime(),
  isMentoringSession = null,
} = {}) => {
  const query = { from: start, to: end };

  if (isMentoringSession === true) {
    query.only_is_mentoring_session = '1';
  } else if (isMentoringSession === false) {
    query.only_not_mentoring_session = '1';
  }

  return querystring.stringify(query);
};

function statistics() {
  const [session] = useSession();
  const [isMentoringSession, setIsMentoringSession] = useState(null);
  const [visualisationType, setVisualisationType] = useState(
    Visualisations.LINE_CHART
  );
  const [dateRange, setDateRange] = useState({
    start: new Date(new Date().getTime() - DEFAULT_DATE_OFFSET),
    end: new Date(),
  });

  const { data, error } = useSWR(
    `/api/responses?${generateQueryParams({
      start: dateRange.start.getTime(),
      end: dateRange.end.getTime(),
      isMentoringSession,
    })}`
  );

  if (!session) {
    return (
      <div>
        <Header />
        <LoginMessage />
      </div>
    );
  }

  const getAverage = name => {
    const average = data ? data.averages[name] : null;
    return average ? Math.ceil(average * 25) : 0;
  };

  const circles = [
    {
      name: 'Safety',
      color: colors.STANDARD_SAFE,
      percentage: getAverage('Safe Care'),
    },
    {
      name: 'Timely',
      color: colors.STANDARD_TIMELY,
      percentage: getAverage('Timely Care'),
    },
    {
      name: 'Individualised',
      color: colors.STANDARD_INDIVIDUALISED,
      percentage: getAverage('Individual Care'),
    },
    {
      name: 'Healthy',
      color: colors.STANDARD_HEALTHY,
      percentage: getAverage('Staying Healthly'),
    },
    {
      name: 'Staff',
      color: colors.STANDARD_STAFF,
      percentage: getAverage('Staff and Resources'),
    },
    {
      name: 'Dignified',
      color: colors.STANDARD_DIGNIFIED,
      percentage: getAverage('Dignified Care'),
    },
    {
      name: 'Effective',
      color: colors.STANDARD_EFFECTIVE,
      percentage: getAverage('Effective Care'),
    },
  ];

  return (
    <div>
      <Header />
      <CirclesAccordion circles={circles} />
      <div className={styles.content}>
        <div className={styles.filters}>
          <Filters
            dateRange={dateRange}
            setDateRange={setDateRange}
            visualisationType={visualisationType}
            setVisualisationType={setVisualisationType}
            isMentoringSession={isMentoringSession}
            setIsMentoringSession={setIsMentoringSession}
          />
        </div>

        <div className={styles.graph}>
          {visualisationType === Visualisations.LINE_CHART ? (
            <LineChart
              data={
                data
                  ? data.responses.map(d => ({
                      timestamp: d.timestamp,
                      scores: d.scores.map(s => ({
                        score: s.score,
                        standardName: s.standards.name,
                        color: StandardColors[s.standards.name],
                      })),
                    }))
                  : []
              }
            />
          ) : (
            <WordCloud
              words={
                data
                  ? data.responses.map(r => r.words.map(w => w.word)).flat()
                  : []
              }
            />
          )}
        </div>
      </div>
    </div>
  );
}

export default statistics;
