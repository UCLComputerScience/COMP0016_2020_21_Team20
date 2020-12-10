import { useSession } from 'next-auth/client';

import { LineChart, Header } from '../components';

import useSWR from '../lib/swr';

function statistics(props) {
  const [session] = useSession();
  const { data, error } = useSWR('/api/responses');

  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header />
      <h1>Statistics</h1>
      {session ? <LineChart /> : <p>Please login to view statistics</p>}
    </div>
  );
}

export default statistics;
