import fetch from 'utils/fetch';

export function  gettoken(query) {
    return fetch({
        url: '/api/hallSystem/member/identification/gettoken',
        method: 'get',
        params: query
    })

}

export function refreshtoken(access_token) {
    return fetch({
        url: '/api/hallSystem/member/identification/refreshtoken',
        method: 'get',
        params: {'access_token': access_token}
    })

}

export function gettingcerttoken(query) {

    return fetch({
        url: '/api/hallSystem/member/identification/getcerttoken',
        method: 'get',
        params:query
    })
}

export function certtokenresult(access_token,cert_token) {

    return fetch({
        url: '/api/hallSystem/member/identification/getcerttokenresult',
        method: 'get',
        params: {'access_token': access_token,'cert_token': cert_token}
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