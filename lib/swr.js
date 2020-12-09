import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const useSWRWrapper = (endpoint, options = {}) =>
  useSWR(endpoint, fetcher, options);
export default useSWRWrapper;
