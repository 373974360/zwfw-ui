import fetch from 'utils/fetch';

export function getEnums() {
    return fetch({
        url: '/api/baseSystem/common/enums',
        method: 'get'
    });
}

export function getDicts() {
    return fetch({
        url: '/api/baseSystem/common/dics',
        method: 'get'
    });
}

export function getZwfwEnums() {
    return fetch({
        url: '/api/zwfw/common/zwfwEnums',
        method: 'get'
    });
}
