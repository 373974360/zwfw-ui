import fetch from 'utils/fetch';

export function getLogList(query) {
    return fetch({
        url: '/sysLog/list',
        method: 'get',
        params: query
    });
}
