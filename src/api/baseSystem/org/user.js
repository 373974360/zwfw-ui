import fetch from 'utils/fetch';

export function getUserList(query) {
    return fetch({
        url: '/api/baseSystem/org/user/list',
        method: 'get',
        params: query
    });
}

export function createUser(sysUserVo) {
    const data = sysUserVo;
    return fetch({
        url: '/api/baseSystem/org/user/add',
        method: 'post',
        data
    })
}

export function updateUser(sysUserVo) {
    const data = sysUserVo;
    return fetch({
        url: '/api/baseSystem/org/user/edit',
        method: 'post',
        data
    })
}

export function delUser(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/org/user/dels',
        method: 'post',
        data
    })
}

export function getDeptNameAndUsers(query) {
    return fetch({
        url: '/api/baseSystem/org/user/getDeptNameAndUsers',
        method: 'get',
        params: query
    });
}

export function getAllUser(query) {
    return fetch({
        url: '/api/baseSystem/org/user/getAll',
        method: 'get',
        params: query
    });
}