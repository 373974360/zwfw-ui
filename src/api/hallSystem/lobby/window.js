import fetch from 'utils/fetch';

export function getWindowList(query) {
    return fetch({
        url: '/api/zwfw/window/list',
        method: 'get',
        params: query
    });
}

export function createWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetch({
        url: '/api/zwfw/window/add',
        method: 'post',
        data
    })
}

export function updateWindow(zwfwWindowUserVo) {
    const data = zwfwWindowUserVo;
    return fetch({
        url: '/api/zwfw/window/edit',
        method: 'post',
        data
    })
}

export function delWindow(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/window/dels',
        method: 'post',
        data
    })
}
export function getAllWindow() {
    return fetch({
        url: '/api/hallSystem/window/getAll',
        mothod: 'get'
    });
}

export function delWindowUser(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/windowUser/delete',
        method: 'post',
        data
    })
}

export function createUserWindow(windowId, userIds) {
    const data = {windowId, userIds};
    return fetch({
        url: '/api/zwfw/windowUser/addList',
        method: 'post',
        data
    })
}

export function createZwfwWindowItem(zwfwWindowItemVo) {
    const data = zwfwWindowItemVo;
    return fetch({
        url: '/api/zwfw/windowItem/add',
        method: 'post',
        data
    })
}

export function getAllUserWindow(windowId) {
    return fetch({
        url: '/api/zwfw/windowUser/getAll',
        method: 'get',
        params: {windowId}
    })
}

export function getAllItemWindow(windowId) {
    return fetch({
        url: '/api/zwfw/windowItem/getAll',
        method: 'get',
        params: {windowId}
    })
}

export function deleteZwfwWindowItem(windowId, ids) {
    const data = {windowId, ids};
    return fetch({
        url: '/api/zwfw/windowItem/delete',
        method: 'post',
        data
    })
}


