import fetch from 'utils/fetch';

export function getToReceiveList(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindowCert/toReceiveList',
        method: 'get',
        params: query
    })
}