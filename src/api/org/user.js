/* eslint-disable key-spacing,spaced-comment */
import fetch from 'utils/fetch';

export function getUserList(query) {
    return fetch({
        url: '/sysUser/list',
        method: 'get',
        params: query
    });
}

export function createUser(sysUserVo) {
    const data = sysUserVo;
    return fetch({
        url: '/sysUser/add',
        method: 'post',
        data
    })
}

export function updateUser(sysUserVo) {
    const data = sysUserVo;
    return fetch({
        url: '/sysUser/edit',
        method: 'post',
        data
    })
}
//逻辑删除
export function delUser(ids){
    const data = {ids};
    return fetch({
        url:  '/sysUser/dels',
        method: 'post',
        data
    })
}
    //真实删除
    export   function deleteUser(sysUserVo) {
        const data = sysUserVo;
        return fetch({
            url: '/sysUser/delete',
            method: 'post',
            data
        })
    }
