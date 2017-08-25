import {fetchSys} from 'utils/fetch';

export function getRoleList(query) {
    return fetchSys({
        url: '/sysRole/list',
        method: 'get',
        params: query
    });
}

export function createRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetchSys({
        url: '/sysRole/add',
        method: 'post',
        data
    })
}

export function updateRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetchSys({
        url: '/sysRole/edit',
        method: 'post',
        data
    })
}

export function delRole(ids) {
    const data = {ids};
    return fetchSys({
        url: '/sysRole/dels',
        method: 'post',
        data
    })
}

export function createRoleMenus(roleId, menuIds) {
    const data = {roleId, menuIds};
    return fetchSys({
        url: '/sysRoleMenu/addList',
        method: 'post',
        data
    })
}

export function createUserRole(roleId, userIds) {
    const data = {roleId, userIds};
    return fetchSys({
        url: '/sysUserRole/addList',
        method: 'post',
        data
    })
}

export function getAllRoleMenus(roleId) {
    return fetchSys({
        url: '/sysRoleMenu/getAll',
        method: 'get',
        params: {roleId}
    })
}
export function getAllUserRole(roleId) {
    return fetchSys({
        url: '/sysUserRole/getAll',
        method: 'get',
        params: {roleId}
    })
}

