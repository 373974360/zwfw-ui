import {fetchJob} from 'utils/fetch';

export function getOrganZpxxList(query) {
    return fetchJob({
        url: '/jobOrganZpxx/list',
        method: 'get',
        params: query
    });
}

export function delOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/dels',
        method: 'post',
        data
    });
}

export function shOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/sh',
        method: 'post',
        data
    });
}

export function cxOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/cx',
        method: 'post',
        data
    });
}

export function tjOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/tj',
        method: 'post',
        data
    });
}

export function qxtjOrganZpxx(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobOrganZpxx/qxtj',
        method: 'post',
        data
    });
}