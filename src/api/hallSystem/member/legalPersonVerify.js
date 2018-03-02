import fetch from 'utils/fetch';

export function getAll(query) {
    return fetch({
        url: '/api/hallSystem/legalPersonVerify/getAll',
        method: 'get',
        params: query
    })
}

export function getPage(query) {
    return fetch({
        url: '/api/hallSystem/legalPersonVerify/list',
        method: 'get',
        params: query
    })
}

export function verify(legalPersonVerify) {
    const data = legalPersonVerify;
    return fetch({
        url: '/api/hallSystem/legalPersonVerify/verify',
        method: 'post',
        data
    })
}

