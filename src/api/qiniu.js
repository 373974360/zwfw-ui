import {fetchSys} from 'utils/fetch';

export function getToken() {
  return fetchSys({
    url: '/qiniu/upload/token', // 假地址 自行替换
    method: 'get'
  });
}
