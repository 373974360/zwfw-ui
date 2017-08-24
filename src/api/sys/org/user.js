import {fetchSys} from 'utils/fetch';

export function getUserList(query) {
    return fetchSys({
        url: '/sysUser/list',
        method: 'get',
        params: query
    });
}

export function createUser(sysUserVo) {
    const data = sysUserVo;
    return fetchSys({
        url: '/sysUser/add',
        method: 'post',
        data
    })
}

export function updateUser(sysUserVo) {
    const data = sysUserVo;
    return fetchSys({
        url: '/sysUser/edit',
        method: 'post',
        data
    })
}

export function delUser(ids) {
    const data = {ids};
    return fetchSys({
        url: '/sysUser/dels',
        method: 'post',
        data
    })
}

export function getDeptNameAndUsers(query) {
    return fetchSys({
        url: '/sysUser/getDeptNameAndUsers',
        mothod: 'get',
        params: query
    });
}

export function getAllUser() {
    return fetchSys({
        url: '/sysUser/getAll',
        mothod: 'get'
    });
}