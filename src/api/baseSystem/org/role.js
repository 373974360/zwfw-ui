import fetch from 'utils/fetch';

export function getRoleList(query) {
    return fetch({
        url: '/api/baseSystem/org/role/list',
        method: 'get',
        params: query
    });
}

export function createRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetch({
        url: '/api/baseSystem/org/role/add',
        method: 'post',
        data
    })
}

export function updateRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetch({
        url: '/api/baseSystem/org/role/edit',
        method: 'post',
        data
    })
}

export function delRole(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/org/role/dels',
        method: 'post',
        data
    })
}

export function createRoleMenus(roleId, menuIds) {
    const data = {roleId, menuIds};
    return fetch({
        url: '/api/baseSystem/org/roleMenu/addList',
        method: 'post',
        data
    })
}

export function createUserRole(roleId, userIds) {
    const data = {roleId, userIds};
    return fetch({
        url: '/api/baseSystem/org/userRole/addList',
        method: 'post',
        data
    })
}

export function getAllRoleMenus(roleId) {
    return fetch({
        url: '/api/baseSystem/org/roleMenu/getAll',
        method: 'get',
        params: {roleId}
    })
}
export function getAllUserRole(roleId) {
    return fetch({
        url: '/api/baseSystem/org/userRole/getAll',
        method: 'get',
        params: {roleId}
    })
}

