import { Table, Header } from '../components';

function manage() {
  return (
    <div>
      <Header curPath="manage" />
      <h3>Manage the URL's of each question</h3>
      <Table />
    </div>
  );
}

export default manage;
