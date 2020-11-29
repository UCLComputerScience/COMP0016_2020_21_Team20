import { LineChart, Header } from '../components';

function statistics() {
  return (
    //Filters
    //Circles
    //checkboxes inside linechart
    <div>
      <Header curPath="statistics" paths={['statistics', 'self-assessment']} />
      <h1>Statistics</h1>
      <LineChart />
      <LineChart />
      <LineChart />
      <LineChart />
    </div>
  );
}

export default statistics;
