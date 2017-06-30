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

export function delUser(ids) {
    const data = {ids};
    return fetch({
<<<<<<< HEAD
        url: '/sysUser/dels',
=======
        url:  '/sysUser/dels',
>>>>>>> origin/master
        method: 'post',
        data
    })
}
