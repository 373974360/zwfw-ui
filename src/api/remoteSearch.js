import fetchSys from 'utils/fetchSys';

export function userSearch(name) {
  return fetchSys({
    url: '/search/user',
    method: 'get',
    params: { name }
  });
}
