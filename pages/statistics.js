import useSWR from 'swr';

import { LineChart, Header } from '../components';

const fetcher = (...args) => fetch(...args).then(res => res.json());

function statistics(props) {
  const { data, error } = useSWR('/api/responses', fetcher);

  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header curPath="statistics" />
      <h1>Statistics</h1>
      <LineChart />
      <LineChart />
      <LineChart />
      <LineChart />
    </div>
  );
}

export default statistics;
