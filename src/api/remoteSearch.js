import {fetchSys} from 'utils/fetch';

export function userSearch(name) {
  return fetchSys({
    url: '/search/user',
    method: 'get',
    params: { name }
  });
}
