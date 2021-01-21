import querystring from 'querystring';
import { useState } from 'react';
import { getSession } from 'next-auth/client';
import Head from 'next/head';

import styles from './statistics.module.css';

import {
  LineChart,
  Header,
  CirclesAccordion,
  Filters,
  LoginMessage,
  WordCloud,
  NoAccess,
  FeedbackNotification,
} from '../components';

import useSWR from '../lib/swr';
import {
  Roles,
  StandardColors,
  Standards,
  Visualisations,
} from '../lib/constants';

const DEFAULT_DATE_OFFSET = 60 * 60 * 24 * 30 * 1000; // 30 days ago;

const generateQueryParams = ({
  start = new Date().getTime() - DEFAULT_DATE_OFFSET,
  end = new Date().getTime(),
  isMentoringSession = null,
  dataToDisplayOverride,
} = {}) => {
  const query = { from: start, to: end };

  if (isMentoringSession === true) {
    query.only_is_mentoring_session = '1';
  } else if (isMentoringSession === false) {
    query.only_not_mentoring_session = '1';
  }

  if (dataToDisplayOverride) {
    query[dataToDisplayOverride.key] = dataToDisplayOverride.value;
  }

  return querystring.stringify(query);
};

export async function getServerSideProps(context) {
  return { props: { session: await getSession(context) } };
}

function statistics({ session }) {
  const [isMentoringSession, setIsMentoringSession] = useState(null);
  const [dataToDisplayOverride, setDataToDisplayOverride] = useState(null);
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
      dataToDisplayOverride,
    })}`
  );

  if (!session) {
    return (
      <div>
        <Header session={session} />
        <LoginMessage />
      </div>
    );
  }

  const role = session.roles[0]; // TODO do we want to support multiple roles?
  if (role === Roles.USER_TYPE_UNKNOWN || role === Roles.USER_TYPE_ADMIN) {
    return (
      <div>
        <Header session={session} />
        <NoAccess />
      </div>
    );
  }

  const getAverage = name => {
    const average = data ? data.averages[name] : null;
    return average ? Math.ceil(average * 25) : 0;
  };

  const circles = Object.entries(Standards).map(([shortName, longName]) => {
    return {
      name: shortName[0].toUpperCase() + shortName.substr(1).toLowerCase(),
      color: StandardColors[longName],
      percentage: getAverage(longName),
    };
  });

  return (
    <div>
      <Head>
        <title>Statistics</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <Header session={session} />
      <CirclesAccordion circles={circles} />
      <div className={styles.content}>
        <div className={styles.filters}>
          <Filters
            session={session}
            dateRange={dateRange}
            setDateRange={setDateRange}
            visualisationType={visualisationType}
            setVisualisationType={setVisualisationType}
            isMentoringSession={isMentoringSession}
            setIsMentoringSession={setIsMentoringSession}
            dataToDisplayOverride={dataToDisplayOverride}
            setDataToDisplayOverride={setDataToDisplayOverride}
          />
        </div>

        <div className={styles.graph}>
          {visualisationType === Visualisations.LINE_CHART ? (
            <LineChart
              data={
                data
                  ? data.responses.map(d => ({
                      is_mentoring_session: d.is_mentoring_session,
                      timestamp: d.timestamp,
                      scores: d.scores.map(s => ({
                        score: s.score,
                        standardName: s.standards.name,
                        color: StandardColors[s.standards.name],
                      })),
                    }))
                  : null
              }
            />
          ) : (
            <WordCloud
              words={
                data
                  ? data.responses.map(r => r.words.map(w => w.word)).flat()
                  : null
              }
            />
          )}
        </div>
      </div>
      <FeedbackNotification />
    </div>
  );
}

export default statistics;
