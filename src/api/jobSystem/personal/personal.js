import fetch from 'utils/fetch';

export function getPersonalList(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonal/list',
        method: 'get',
        params: query
    });
}
export function getPersional(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonal/get',
        method: 'get',
        params: {memberId}
    });
}
export function getPersionalQzyx(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonalQzyx/get',
        method: 'get',
        params: {memberId}
    });
}
export function getPersionalGzjl(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonalGzjl/getAll',
        method: 'get',
        params: {memberId}
    });
}
export function getPersionalItem(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonalItem/getAll',
        method: 'get',
        params: {memberId}
    });
}
export function getPersionalJyjl(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonalJyjl/getAll',
        method: 'get',
        params: {memberId}
    });
}
export function getPersionalZs(memberId) {
    return fetch({
        url: '/api/jobSystem/jobPersonalZs/getAll',
        method: 'get',
        params: {memberId}
    });
}





