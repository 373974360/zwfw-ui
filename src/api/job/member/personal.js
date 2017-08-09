import fetchJob from 'utils/fetchJob';

export function getPersonalList(query) {
    return fetchJob({
        url: '/jobPersonal/list',
        method: 'get',
        params: query
    });
}




