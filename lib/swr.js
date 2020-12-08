import useSWR from 'swr';

const fetcher = (...args) => fetch(...args).then(res => res.json());
const useSWRWrapper = endpoint => useSWR(endpoint, fetcher);
export default useSWRWrapper;
