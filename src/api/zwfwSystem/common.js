import fetch from 'utils/fetch';

export function getZwfwEnums(query) {
    return fetch({
        url: '/api/zwfw//enums',
        method: 'get',
        params: query
    });
}
