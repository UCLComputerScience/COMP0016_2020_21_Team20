import querystring from 'querystring';

import { useState } from 'react';

import { useSession } from 'next-auth/client';

import {
  LineChart,
  Header,
  Accordion,
  Filters,
  LoginMessage,
  WordCloud,
} from '../components';

import styles from './statistics.module.css';

import useSWR from '../lib/swr';
import { StandardColors, Visualisations } from '../lib/constants';

const DEFAULT_DATE_OFFSET = 60 * 60 * 24 * 30 * 1000; // 30 days ago;

const generateQueryParams = ({
  start = new Date().getTime() - DEFAULT_DATE_OFFSET,
  end = new Date().getTime(),
  isMentoringSession = false,
} = {}) =>
  querystring.stringify({
    from: start,
    to: end,
    is_mentoring_session: isMentoringSession ? '1' : '0',
  });

function statistics(props) {
  const [session] = useSession();
  const [isMentoringSession, setIsMentoringSession] = useState(false);
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

  return (
    <div>
      <Header />
      <Accordion />
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
          <LineChart
            data={
              data
                ? data.map(d => ({
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
          {/* <WordCloud /> */}
        </div>
      </div>
    </div>
  );
}

export default statistics;
