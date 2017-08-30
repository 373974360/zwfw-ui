import {fetchJob} from 'utils/fetch';

export function getPersonalList(query) {
    return fetchJob({
        url: '/jobPersonal/list',
        method: 'get',
        params: query
    });
}

export function delPersonal(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobPersonal/dels',
        method: 'post',
        data
    })
}

export function getPersonal(query) {
    return fetchJob({
        url: '/jobPersonal/get',
        method: 'get',
        params: query
    });
}

export function getPersonalQzyx(query) {
    return fetchJob({
        url: '/jobPersonalQzyx/get',
        method: 'get',
        params: query
    });
}

export function getPersonalGzjl(query) {
    return fetchJob({
        url: '/jobPersonalGzjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalItem(query) {
    return fetchJob({
        url: '/jobPersonalItem/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalJyjl(query) {
    return fetchJob({
        url: '/jobPersonalJyjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalZs(query) {
    return fetchJob({
        url: '/jobPersonalZs/getAll',
        method: 'get',
        params: query
    });
}


export function tjPersonal(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobPersonal/tj',
        method: 'post',
        data
    });
}

export function qxtjPersonal(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobPersonal/qxtj',
        method: 'post',
        data
    });
}




