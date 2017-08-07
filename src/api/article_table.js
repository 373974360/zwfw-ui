import fetchSys from 'utils/fetchSys';

export function fetchList(query) {
  return fetchSys({
    url: '/article_table/list',
    method: 'get',
    params: query
  });
}

export function fetchPv(pv) {
  return fetchSys({
    url: '/article_table/pv',
    method: 'get',
    params: { pv }
  });
}
