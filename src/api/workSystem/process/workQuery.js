import fetch from 'utils/fetch';

/**
 * 查询办件
 */
export function getZwfwDeptWorkQueryList(q) {
    return fetch({
        url: '/api/workSystem/itemProcessWork/getDeptWorkList',
        method: 'get',
        params: q
    });
}
/**
 * 办结查询
 * @param q
 */
export function getWorkFinishList(q) {
    return fetch({
        url: '/api/workSystem/itemProcessWork/getWorkFinishList',
        method: 'get',
        params: q
    });
}
/**
 * 办件详细信息
 * @param query
 * @returns {*}
 */
export function getZwfwDeptWorkDetail(query) {
    return fetch({
        url: '/api/workSystem/itemProcessWork/getDeptWorkDetail',
        method: 'get',
        params: query
    });
}
