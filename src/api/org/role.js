/* eslint-disable key-spacing */
/**
 * Created by Administrator on 2017/7/3 0003.
 */
import fetch from 'utils/fetch';

export function getRoleList(query) {
    return fetch({
        url: '/sysRole/list',
        method: 'get',
        params: query
    });
}

export function createRole(SysRoleVo){
    const data = SysRoleVo;
    return fetch({
        url: '/sysRole/add',
        method: 'post',
        data
    })
}

export function updateRole(SysRoleVo) {
    const data = SysRoleVo;
    return fetch({
        url: '/sysRole/edit',
        method: 'post',
        data
    })
}

export function delRole(id){
    const data = {id};
    return fetch({
        url:  '/sysRole/dels',
        method: 'post',
        data
    })
}
