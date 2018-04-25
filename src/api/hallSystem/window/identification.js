import fetch from 'utils/fetch';

export function  getAccessToken(clientInfo) {
    return fetch({
        url: '/api/hallSystem/window/identification/getAccessToken',
        method: 'get',
        params: clientInfo
    })

}

export function getCertToken(query) {
    return fetch({
        url: '/api/hallSystem/window/identification/getCertToken',
        method: 'get',
        params:query
    })
}

export function getCertResult(query) {
    return fetch({
        url: '/api/hallSystem/window/identification/getCertResult',
        method: 'get',
        params: query
    })
}