import {fetchZwfw} from 'utils/fetch';

export function getZwfwDeptSuperviseList(q) {

    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetail(query) {
    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}

export function workSetSupervised(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workSetSupervised',
        method: 'post',
        data
    })
}

export function workCancelSupervised(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workCancelSupervised',
        method: 'post',
        data
    })
}

