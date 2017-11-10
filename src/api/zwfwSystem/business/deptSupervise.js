import fetch from 'utils/fetch';

/**
 * 督办列表
 * @param q
 */
export function getDeptSuperviseList(q) {

    return fetch({
        url: '/api/workSystem/itemProcessWork/getDeptWorkList',
        method: 'get',
        params: q
    });
}

/**
 * 办件详细
 * @param query
 */
export function getDeptWorkDetail(query) {
    return fetch({
        url: '/api/workSystem/itemProcessWork/getDeptWorkDetail',
        method: 'get',
        params: query
    });
}

/**
 * 设置为督办
 * @param query
 */
export function workSetSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/workSystem/itemProcessWork/workSetSupervised',
        method: 'post',
        data
    })
}

/**
 * 取消督办
 * @param query
 */
export function workCancelSupervised(query) {
    const data = query;
    return fetch({
        url: '/api/workSystem/itemProcessWork/workCancelSupervised',
        method: 'post',
        data
    })
}

