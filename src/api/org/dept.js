import fetch from 'utils/fetch';

export function getDeptList(query) {
    return fetch({
        url: '/sysDept/list',
        method: 'get',
        params: query
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

export function sendPWD2Email(account){
    return fetch({
        url: '/sysUser/select',
        method: 'get',
        params: {account}
    });
}

export function logout() {
    return fetch({
        url: '/login/logout',
        method: 'post'
    });
}




