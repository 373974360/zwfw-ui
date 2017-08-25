import {fetchSys} from 'utils/fetch';

export function getLogList(query) {
    return fetchSys({
        url: '/sysLog/list',
        method: 'get',
        params: query
    });
}
