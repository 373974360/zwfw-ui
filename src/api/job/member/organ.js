import {fetchJob} from 'utils/fetch';


export function getOrganList(query) {
    return fetchJob({
        url: '/jobOrgan/list',
        method: 'get',
        params: query
    });
}

export function delOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/dels',
        method: 'post',
        data
    })
}

export function getMember(query) {
    return fetchJob({
        url: '/jobOrgan/get',
        method: 'get',
        params: query
    });
}

export function jobOrganAuth(query) {
    return fetchJob({
        url: '/jobOrganAuth/get',
        method: 'get',
        params: query
    });
}
export function jobMemberIntegral(query) {
    return fetchJob({
        url: '/jobMemberIntegral/getAll',
        method: 'get',
        params: query
    });
}



export function shOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/sh',
        method: 'post',
        data
    });
}

export function cxOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/cx',
        method: 'post',
        data
    });
}

export function tjOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/tj',
        method: 'post',
        data
    });
}

export function qxtjOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/qxtj',
        method: 'post',
        data
    });
}

export function authOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/auth',
        method: 'post',
        data
    });
}

export function qxauthOrgan(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrgan/qxauth',
        method: 'post',
        data
    });
}


