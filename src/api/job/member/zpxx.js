import {fetchJob} from 'utils/fetch';

export function getOrganZpxxList(query) {
    return fetchJob({
        url: '/jobOrganZpxx/list',
        method: 'get',
        params: query
    });
}

export function delOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/dels',
        method: 'post',
        data
    });
}