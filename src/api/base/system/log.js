import fetch from 'utils/fetch';

export function getLogList(query) {
    return fetch({
        url: '/api/admin/sysLog/list',
        method: 'get',
        params: query
    });
}
