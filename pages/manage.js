import { Tab } from '@material-ui/core';
import { Table, Header } from '../components';

function manage() {
  return (
    <div>
      <Header curPath="manage" />
      <h1>Manage Users</h1>
      <Table />
    </div>
  );
}

export default manage;
