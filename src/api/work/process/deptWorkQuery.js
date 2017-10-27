import fetch from 'utils/fetch';

/**
 * 查询办件
 */
export function getZwfwDeptWorkQueryList(q) {

    return fetch({
        url: '/api/zwfw/ItemProcessWork/getZwfwDeptWorkList',
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
        url: '/api/zwfw/ItemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}
