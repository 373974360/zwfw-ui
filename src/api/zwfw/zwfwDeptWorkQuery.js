import {fetchZwfw} from 'utils/fetch';

/**
 * 查询办件
 */
export function getZwfwDeptWorkQueryList(q) {

    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkList',
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
    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}
