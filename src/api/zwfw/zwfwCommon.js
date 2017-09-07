import {fetchZwfw} from 'utils/fetch';

export function getZwfwEnums(query) {
    return fetchZwfw({
        url: '/zwfw/enums',
        method: 'get',
        params: query
    });
}
