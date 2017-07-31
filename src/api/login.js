import fetch from 'utils/fetch';

export function loginByEmail(userInfo) {
    const data = userInfo;
    return fetch({
        url: '/base/sysLogin',
        method: 'post',
        data
    });
}

export function getInfo(token) {
    const data = {id: token};
    return fetch({
        url: '/sysUser/get',
        method: 'get',
        params: data
    });
}

export function sendPWD2Email(account){
    return fetch({
        url: '/sysUser/get',
        method: 'get',
        params: {account}
    });
}

export function logout() {
    return fetch({
        url: '/base/sysLogout',
        method: 'post'
    });
}




