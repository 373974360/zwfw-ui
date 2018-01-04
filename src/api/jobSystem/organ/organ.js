import fetch from 'utils/fetch';


export function getOrganList(query) {
    return fetch({
        url: '/api/jobSystem/jobOrgan/list',
        method: 'get',
        params: query
    });
}

export function getOrgan(memberId) {
    return fetch({
        url: '/api/jobSystem/jobOrgan/get',
        method: 'get',
        params: {memberId}
    });
}
export function getOrganAuth(memberId) {
    return fetch({
        url: '/api/jobSystem/jobOrganAuth/get',
        method: 'get',
        params: {memberId}
    });
}

export function resetJobOrgan(data) {
    return fetch({
        url: '/api/jobSystem/jobOrgan/reset',
        method: 'post',
        data
    })
}