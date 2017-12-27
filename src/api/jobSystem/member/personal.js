import fetch from 'utils/fetch';

export function getPersonalList(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonal/list',
        method: 'get',
        params: query
    });
}

export function delPersonal(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobPersonal/dels',
        method: 'post',
        data
    })
}

export function getPersonal(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonal/get',
        method: 'get',
        params: query
    });
}

export function getPersonalQzyx(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonalQzyx/get',
        method: 'get',
        params: query
    });
}

export function getPersonalGzjl(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonalGzjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalItem(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonalItem/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalJyjl(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonalJyjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalZs(query) {
    return fetch({
        url: '/api/jobSystem/jobPersonalZs/getAll',
        method: 'get',
        params: query
    });
}


export function tjPersonal(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobPersonal/tj',
        method: 'post',
        data
    });
}

export function qxtjPersonal(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobPersonal/qxtj',
        method: 'post',
        data
    });
}




