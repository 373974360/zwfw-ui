import {fetchSys} from 'utils/fetch';

export function getRoleList(query) {
    return fetchSys({
        url: '/api/admin/sysRole/list',
        method: 'get',
        params: query
    });
}

export function createRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetchSys({
        url: '/api/admin/sysRole/add',
        method: 'post',
        data
    })
}

export function updateRole(sysRoleVo) {
    const data = sysRoleVo;
    return fetchSys({
        url: '/api/admin/sysRole/edit',
        method: 'post',
        data
    })
}

export function delRole(ids) {
    const data = {ids};
    return fetchSys({
        url: '/api/admin/sysRole/dels',
        method: 'post',
        data
    })
}

export function createRoleMenus(roleId, menuIds) {
    const data = {roleId, menuIds};
    return fetchSys({
        url: '/api/admin/sysRoleMenu/addList',
        method: 'post',
        data
    })
}

export function createUserRole(roleId, userIds) {
    const data = {roleId, userIds};
    return fetchSys({
        url: '/api/admin/sysUserRole/addList',
        method: 'post',
        data
    })
}

export function getAllRoleMenus(roleId) {
    return fetchSys({
        url: '/api/admin/sysRoleMenu/getAll',
        method: 'get',
        params: {roleId}
    })
}
export function getAllUserRole(roleId) {
    return fetchSys({
        url: '/api/admin/sysUserRole/getAll',
        method: 'get',
        params: {roleId}
    })
}

