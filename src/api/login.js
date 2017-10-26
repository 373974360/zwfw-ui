import {fetchSys} from 'utils/fetch';

export function loginByEmail(userInfo) {
    const data = userInfo;
    return fetchSys({
        url: '/api/auth/jwt/token',
        method: 'post',
        data
    });
}

export function getInfo() {
    return fetchSys({
        url: '/api/admin/sysUser/getMyProfile',
        method: 'get'
    });
}

export function sendPWD2Email(account){
    return fetchSys({
        url: '/api/admin/sysUser/get',
        method: 'get',
        params: {account}
    });
}

export function logout() {
    return fetchSys({
        url: '/api/admin/base/sysLogout',
        method: 'post'
    });
}




