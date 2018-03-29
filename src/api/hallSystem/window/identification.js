import fetch from 'utils/fetch';

export function  getAccessToken(clientInfo) {
    return fetch({
        url: '/wiiauth/getaccesstoken',
        method: 'get',
        params: clientInfo
    })

}

export function refreshAccessToken(access_token) {
    return fetch({
        url: '/wiiauth/refreshaccesstoken',
        method: 'get',
        params: {access_token}
    })
}

export function getCertToken(query) {
    return fetch({
        url: '/wiiauth/getcerttoken',
        method: 'get',
        params:query
    })
}

export function getCertResult(query) {
    return fetch({
        url: '/wiiauth/getcertresult',
        method: 'get',
        params: query
    })
}


export function pushcertres(identificresult) {

  const data = identificresult;
    return fetch({
        url: '/api/hallSystem/identification/callback/resvResult',
        method: 'post',
        data
    })
}