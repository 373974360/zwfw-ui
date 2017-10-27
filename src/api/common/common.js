import fetch from 'utils/fetch';

export function getEnums() {
    return fetch({
        url: '/api/admin/base/enums',
        method: 'get'
    });
}

export function getDicts() {
    return fetch({
        url: '/api/admin/base/dicts',
        method: 'get'
    });
}

export function getZwfwEnums() {
    return fetch({
        url: '/api/zwfw/enums',
        method: 'get'
    });
}
