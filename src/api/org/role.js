import fetch from 'utils/fetch';

export function getRoleList(query) {
    return fetch({
        url: '/sysRole/list',
        method: 'get',
        params: query
    });
}

export function createRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetch({
        url: '/sysRole/add',
        method: 'post',
        data
    })
}

export function updateRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetch({
        url: '/sysRole/edit',
        method: 'post',
        data
    })
}

export function delRole(ids) {
    const data = {ids};
    return fetch({
        url: '/sysRole/del',
        method: 'post',
        data
    })
}

export function createRoleMenus(roleId, menuIds) {
    const data = {roleId, menuIds};
    return fetch({
        url: '/sysRoleMenu/addList',
        method: 'post',
        data
    })
}

export function createUserRole(roleId, userIds) {
    const data = {roleId, userIds};
    return fetch({
        url: '/sysUserRole/addList',
        method: 'post',
        data
    })
}

export function getAllRoleMenus(roleId) {
    return fetch({
        url: '/sysRoleMenu/getAll',
        method: 'get',
        params: {roleId}
    })
}
export function getAllUserRole(roleId) {
    return fetch({
        url: '/sysUserRole/getAll',
        method: 'get',
        params: {roleId}
    })
}

