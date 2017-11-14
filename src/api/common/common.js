import fetch from 'utils/fetch';

export function getEnums() {
    return fetch({
        url: '/api/common/enums',
        method: 'get'
    });
}

export function getDicts() {
    return fetch({
        url: '/api/common/dics',
        method: 'get'
    });
}
