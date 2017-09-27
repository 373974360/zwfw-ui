import {fetchZwfw} from 'utils/fetch';

/**
 * 查询当前用户的待处理事项
 * @param type 类型，1=我的待处理任务，2=所有待处理任务
 * @param search 搜索关键字
 */
export function getZwfwDeptWorkPendingList(q) {

    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkPendingList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetailList(query) {
    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkDetail',
        method: 'get',
        params: query
    });
}
export function workComplete(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workComplete',
        method: 'post',
        data
    })
}
export function workCorrection(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workCorrection',
        method: 'post',
        data
    })
}
export function workExtendTime(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workExtendTime',
        method: 'post',
        data
    })
}
export function workClose(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workClose',
        method: 'post',
        data
    })
}
export function workCancelExtendTime(query) {
    const data = query;
    return fetchZwfw({
        url: '/zwfwItemProcessWork/workCancelExtendTime',
        method: 'post',
        data
    })
}

