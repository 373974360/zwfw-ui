import fetch from 'utils/fetch';

export function loginByEmail(userInfo) {
    const data = userInfo;
    return fetch({
        url: '/base/sysLogin',
        method: 'post',
        data
    });
}

export function logout() {
    return fetch({
        url: '/login/logout',
        method: 'post'
    });
}



export function getInfo(token) {
    const data = {id: token};
    return fetch({
        url: '/sysUser/select',
        method: 'get',
        params: data
    });
}

