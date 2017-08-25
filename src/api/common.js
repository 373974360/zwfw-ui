import {fetchSys} from 'utils/fetch';

export function getEnums() {
    return fetchSys({
        url: '/base/enums',
        method: 'get'
    });
}

export function getDicts() {
    return fetchSys({
        url: '/base/dicts',
        method: 'get'
    });
}
