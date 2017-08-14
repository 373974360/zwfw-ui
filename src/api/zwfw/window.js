import fetchZwfw from 'utils/fetchZwfw';

export function getWindowList(query) {
    return fetchZwfw({
        url: '/zwfwWindow/list',
        method: 'get',
        params: query
    });
}

export function createWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetchZwfw({
        url: '/zwfwWindow/add',
        method: 'post',
        data
    })
}

export function updateWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetchZwfw({
        url: '/zwfwWindow/edit',
        method: 'post',
        data
    })
}

export function delWindow(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwWindow/dels',
        method: 'post',
        data
    })
}
export function delWindowUser(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwWindowUser/delete',
        method: 'post',
        data
    })
}
export function createUserWindow(windowId, userIds) {
    const data = {windowId, userIds};
    return fetchZwfw({
        url: '/zwfwWindowUser/addList',
        method: 'post',
        data
    })
}

export function getAllUserWindow(windowId) {
    return fetchZwfw({
        url: '/zwfwWindowUser/getAll',
        method: 'get',
        params: {windowId}
    })
}



