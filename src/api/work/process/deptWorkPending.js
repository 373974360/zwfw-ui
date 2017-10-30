import fetch from 'utils/fetch';

/**
 * 查询当前用户的待处理事项
 * @param type 类型，1=我的待处理任务，2=所有待处理任务
 * @param search 搜索关键字
 */
export function getZwfwDeptWorkPendingList(q) {

    return fetch({
        url: '/api/zwfw/itemProcessWork/getDeptWorkPendingList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetail(query) {
    return fetch({
        url: '/api/zwfw/itemProcessWork/getDeptWorkDetail',
        method: 'get',
        params: query
    });
}

export function workComplete(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workComplete',
        method: 'post',
        data
    })
}

export function workCorrection(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workCorrection',
        method: 'post',
        data
    })
}

export function workExtendTime(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workExtendTime',
        method: 'post',
        data
    })
}

export function workClose(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workClose',
        method: 'post',
        data
    })
}

export function workCancelExtendTime(query) {
    const data = query;
    return fetch({
        url: '/api/zwfw/itemProcessWork/workCancelExtendTime',
        method: 'post',
        data
    })
}

