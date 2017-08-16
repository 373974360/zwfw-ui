import fetchJob from 'utils/fetchJob';

export function getOrganZpxxList(query) {
    return fetchJob({
        url: '/jobOrganZpxx/list',
        method: 'get',
        params: query
    });
}delOrganZpxx

export function delOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/dels',
        method: 'post',
        data
    });
}