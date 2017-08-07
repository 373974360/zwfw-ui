import fetchSys from 'utils/fetchSys';

export function getEnums() {
    return fetchSys({
        url: '/base/enums',
        method: 'get'
    });
}
