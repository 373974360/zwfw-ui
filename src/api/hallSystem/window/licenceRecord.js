import fetch from 'utils/fetch';

export function  getLicenceList(query) {
    return fetch({
        url: '/api/licence/licenceRecord/list',
        method: 'get',
        params: query
    })
}
