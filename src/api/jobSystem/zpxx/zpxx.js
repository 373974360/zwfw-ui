import fetch from 'utils/fetch';

export function getOrganZpxxList(query) {
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/list',
        method: 'get',
        params: query
    });
}

export function delOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/dels',
        method: 'post',
        data
    });
}

export function shOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/sh',
        method: 'post',
        data
    });
}

export function cxOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/cx',
        method: 'post',
        data
    });
}

export function tjOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/tj',
        method: 'post',
        data
    });
}

export function qxtjOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/qxtj',
        method: 'post',
        data
    });
}