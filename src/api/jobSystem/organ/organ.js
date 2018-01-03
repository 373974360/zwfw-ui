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