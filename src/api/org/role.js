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
