import fetch from 'utils/fetch';

export function getZwfwDeptSuperviseList(q) {

    return fetch({
        url: '/api/zwfw/itemProcessWork/getZwfwDeptWorkList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetail(query) {
    return fetch({
        url: '/api/zwfw/itemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}

export function workSetSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workSetSupervised',
        method: 'post',
        data
    })
}

export function workCancelSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workCancelSupervised',
        method: 'post',
        data
    })
}

