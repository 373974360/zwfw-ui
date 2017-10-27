import fetch from 'utils/fetch';

export function getZwfwDeptSuperviseList(q) {

    return fetch({
        url: '/api/zwfw/ItemProcessWork/getZwfwDeptWorkList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetail(query) {
    return fetch({
        url: '/api/zwfw/ItemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}

export function workSetSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/ItemProcessWork/workSetSupervised',
        method: 'post',
        data
    })
}

export function workCancelSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/ItemProcessWork/workCancelSupervised',
        method: 'post',
        data
    })
}

