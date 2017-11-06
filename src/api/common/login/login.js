import fetch from 'utils/fetch';

export function loginByEmail(userInfo) {
    const data = userInfo;
    return fetch({
        url: '/api/auth/jwt/token',
        method: 'post',
        data
    });
}

export function getInfo() {
    return fetch({
        url: '/api/baseSystem/org/user/getMyProfile',
        method: 'get'
    });
}

export function sendPWD2Email(account) {
    return fetch({
        url: '/api/baseSystem/org/user/get',
        method: 'get',
        params: {account}
    });
}

export function logout() {
    return fetch({
        url: '/api/auth/jwt/invalid',
        method: 'post'
    });
}




