import fetchSys from 'utils/fetchSys';

export function getLogList(query) {
    return fetchSys({
        url: '/sysLog/list',
        method: 'get',
        params: query
    });
}
