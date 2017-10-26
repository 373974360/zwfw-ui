import {fetchSys} from 'utils/fetch';

export function getLogList(query) {
    return fetchSys({
        url: '/api/admin/sysLog/list',
        method: 'get',
        params: query
    });
}
