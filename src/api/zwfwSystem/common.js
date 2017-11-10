import fetch from 'utils/fetch';

export function getZwfwEnums(query) {
    return fetch({
        url: '/api/workSystem/enums',
        method: 'get',
        params: query
    });
}
