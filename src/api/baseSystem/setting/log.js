import fetch from 'utils/fetch';

export function getLogList(query) {
    return fetch({
        url: '/api/baseSystem/setting/log/list',
        method: 'get',
        params: query
    });
}
