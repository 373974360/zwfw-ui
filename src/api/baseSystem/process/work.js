import fetch from 'utils/fetch';

/**
 * 查询当前用户的待处理事项
 * @param type 类型，1=我的待处理任务，2=所有待处理任务
 * @param search 搜索关键字
 */
export function getZwfwDeptWorkPendingList(q) {

    return fetch({
        url: '/api/yl12345/processWork/getDeptWorkPendingList',
        method: 'get',
        params: q
    });
}

/**
 * 查询当前用户创建的任务
 * @param type 类型，1=我的待处理任务，2=所有待处理任务
 * @param search 搜索关键字
 */
export function getZwfwDeptWorkCreateList(q) {
    return fetch({
        url: '/api/yl12345/processWork/getDeptWorkCreateList',
        method: 'get',
        params: q
    });
}

export function getZwfwDeptWorkDetail(query) {
    return fetch({
        url: '/api/yl12345/processWork/getDeptWorkDetail',
        method: 'get',
        params: query
    });
}

export function getWorkAttchements(query) {
    return fetch({
        url: '/api/yl12345/processAttachment/getByProcessNumber',
        method: 'get',
        params: query
    });
}

export function workCreate(process) {
    const data = process;
    return fetch({
        url: '/api/yl12345/process/workCreate',
        method: 'post',
        data
    })
}

export function workComplete(query) {
    const data = query;
    return fetch({
        url: '/api/yl12345/processWork/workComplete',
        method: 'post',
        data
    })
}

export function workCorrection(query) {
    const data = query;
    return fetch({
        url: '/api/yl12345/processWork/workCorrection',
        method: 'post',
        data
    })
}

export function workExtendTime(query) {
    const data = query;
    return fetch({
        url: '/api/yl12345/processWork/workExtendTime',
        method: 'post',
        data
    })
}

export function workClose(query) {
    const data = query;
    return fetch({
        url: '/api/yl12345/processWork/workClose',
        method: 'post',
        data
    })
}

export function workCancelExtendTime(query) {
    const data = query;
    return fetch({
        url: '/api/yl12345/processWork/workCancelExtendTime',
        method: 'post',
        data
    })
}

export function workuploadImg(itemProcessAttachmentVo) {
    const data = itemProcessAttachmentVo;
    return fetch({
        url: '/api/yl12345/processAttachment/uploadImg',
        method: 'post',
        data
    })
}

export function workUploadImgRemove(itemProcessAttachmentVo) {
    const data = itemProcessAttachmentVo;
    return fetch({
        url: '/api/yl12345/processAttachment/uploadImgRemove',
        method: 'post',
        data
    })
}

/**
 * 查询办件
 */
export function getZwfwDeptWorkQueryList(q) {
    return fetch({
        url: '/api/yl12345/processWork/getDeptWorkList',
        method: 'get',
        params: q
    });
}

/**
 * 我的办件
 */
export function getMyDeptWorkList(q) {
    return fetch({
        url: '/api/yl12345/processWork/getMyDeptWorkList',
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
        url: '/api/yl12345/processWork/getWorkFinishList',
        method: 'get',
        params: q
    });
}

