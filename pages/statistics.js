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

import { Visualisations } from '../lib/constants';

function statistics(props) {
  const [session] = useSession();

  const [dateRange, setDateRange] = useState({
    start: new Date(),
    end: new Date(),
  });
  const [visualisationType, setVisualisationType] = useState(
    Visualisations.LINE_CHART
  );
  const [isMentoringSession, setIsMentoringSession] = useState(true);

  // const { data, error } = useSWR('/api/responses');
  // console.log(data);

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
          <LineChart />
          <WordCloud />
        </div>
      </div>
    </div>
  );
}

export default statistics;
