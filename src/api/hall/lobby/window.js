import fetch from 'utils/fetch';

export function getWindowList(query) {
    return fetch({
        url: '/api/zwfw/Window/list',
        method: 'get',
        params: query
    });
}

export function createWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetch({
        url: '/api/zwfw/Window/add',
        method: 'post',
        data
    })
}

export function updateWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetch({
        url: '/api/zwfw/Window/edit',
        method: 'post',
        data
    })
}

export function delWindow(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/Window/dels',
        method: 'post',
        data
    })
}
export function getAllWindow() {
    return fetch({
        url: '/api/zwfw/Window/getAll',
        mothod: 'get'
    });
}

export function delWindowUser(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/WindowUser/delete',
        method: 'post',
        data
    })
}

export function createUserWindow(windowId, userIds) {
    const data = {windowId, userIds};
    return fetch({
        url: '/api/zwfw/WindowUser/addList',
        method: 'post',
        data
    })
}

export function createZwfwWindowItem(zwfwWindowItemVo) {
    const data = zwfwWindowItemVo;
    return fetch({
        url: '/api/zwfw/WindowItem/add',
        method: 'post',
        data
    })
}

export function getAllUserWindow(windowId) {
    return fetch({
        url: '/api/zwfw/WindowUser/getAll',
        method: 'get',
        params: {windowId}
    })
}

export function getAllItemWindow(windowId) {
    return fetch({
        url: '/api/zwfw/WindowItem/getAll',
        method: 'get',
        params: {windowId}
    })
}

export function deleteZwfwWindowItem(windowId, ids) {
    const data = {windowId, ids};
    return fetch({
        url: '/api/zwfw/WindowItem/delete',
        method: 'post',
        data
    })
}


