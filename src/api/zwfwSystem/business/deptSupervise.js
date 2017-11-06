import fetch from 'utils/fetch';

export function getDeptSuperviseList(q) {

    return fetch({
        url: '/api/zwfw/itemProcessWork/getDeptWorkList',
        method: 'get',
        params: q
    });
}

export function getDeptWorkDetail(query) {
    return fetch({
        url: '/api/zwfw/itemProcessWork/getDeptWorkDetail',
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

