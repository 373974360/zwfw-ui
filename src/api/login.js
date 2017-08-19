import fetchSys from 'utils/fetchSys';

export function loginByEmail(userInfo) {
    const data = userInfo;
    return fetchSys({
        url: '/base/sysLogin',
        method: 'post',
        data
    });
}

export function getInfo() {
    return fetchSys({
        url: '/sysUser/getMyProfile',
        method: 'get'
    });
}

export function sendPWD2Email(account){
    return fetchSys({
        url: '/sysUser/get',
        method: 'get',
        params: {account}
    });
}

export function logout() {
    return fetchSys({
        url: '/base/sysLogout',
        method: 'post'
    });
}




