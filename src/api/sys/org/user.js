import {fetchSys} from 'utils/fetch';

export function getUserList(query) {
    return fetchSys({
        url: '/api/admin/sysUser/list',
        method: 'get',
        params: query
    });
}

export function createUser(sysUserVo) {
    const data = sysUserVo;
    return fetchSys({
        url: '/api/admin/sysUser/add',
        method: 'post',
        data
    })
}

export function updateUser(sysUserVo) {
    const data = sysUserVo;
    return fetchSys({
        url: '/api/admin/sysUser/edit',
        method: 'post',
        data
    })
}

export function delUser(ids) {
    const data = {ids};
    return fetchSys({
        url: '/api/admin/sysUser/dels',
        method: 'post',
        data
    })
}

export function getDeptNameAndUsers(query) {
    return fetchSys({
        url: '/api/admin/sysUser/getDeptNameAndUsers',
        mothod: 'get',
        params: query
    });
}

export function getAllUser() {
    return fetchSys({
        url: '/api/admin/sysUser/getAll',
        mothod: 'get'
    });
}