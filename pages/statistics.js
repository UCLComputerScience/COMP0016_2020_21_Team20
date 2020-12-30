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

function statistics(props) {
  const [session] = useSession();

  // TODO actually use these
  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [visualisationType, setVisualisationType] = useState(
    Visualisations.LINE_CHART
  );
  const [isMentoringSession, setIsMentoringSession] = useState(true);

  const { data, error } = useSWR('/api/responses');

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
      <h1>Your Statistics</h1>
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
