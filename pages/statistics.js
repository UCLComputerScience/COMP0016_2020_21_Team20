import useSWR from '../lib/swr';

import { LineChart, Header } from '../components';

function statistics(props) {
  const { data, error } = useSWR('/api/responses');

  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header curPath="statistics" />
      <h1>Statistics</h1>
      <LineChart />
    </div>
  );
}

export default statistics;
