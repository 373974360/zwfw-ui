import fetch from 'utils/fetch';


export function getOrganList(query) {
    return fetch({
        url: '/api/jobSystem/jobOrgan/list',
        method: 'get',
        params: query
    });
}

export function delOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/dels',
        method: 'post',
        data
    })
}

export function getMember(query) {
    return fetch({
        url: '/api/jobSystem/jobOrgan/get',
        method: 'get',
        params: query
    });
}

export function jobOrganAuth(query) {
    return fetch({
        url: '/api/jobSystem/jobOrganAuth/get',
        method: 'get',
        params: query
    });
}
export function jobMemberIntegral(query) {
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/getAll',
        method: 'get',
        params: query
    });
}



export function shOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/sh',
        method: 'post',
        data
    });
}

export function cxOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/cx',
        method: 'post',
        data
    });
}

export function tjOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/tj',
        method: 'post',
        data
    });
}

export function qxtjOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/qxtj',
        method: 'post',
        data
    });
}

export function authOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/auth',
        method: 'post',
        data
    });
}

export function qxauthOrgan(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrgan/qxauth',
        method: 'post',
        data
    });
}


