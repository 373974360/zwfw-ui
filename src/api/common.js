import fetch from 'utils/fetch';

export function getEnums() {
    return fetch({
        url: '/base/enums',
        method: 'get'
    });
}
