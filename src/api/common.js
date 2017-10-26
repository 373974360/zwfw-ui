import {fetchSys, fetchZwfw} from 'utils/fetch';

export function getEnums() {
    return fetchSys({
        url: '/api/admin/base/enums',
        method: 'get'
    });
}

export function getDicts() {
    return fetchSys({
        url: '/api/admin/base/dicts',
        method: 'get'
    });
}

export function getZwfwEnums() {
    return fetchZwfw({
        url: '/api/zwfw/enums',
        method: 'get'
    });
}
