import fetch from 'utils/fetch';

export function getAttClockRecords(query) {
    return fetch({
        url: '/api/hallSystem/hikvision/getAttClockRecords',
        method: 'get',
        params: query
    });
}
export function getDoorEventsHistory(query) {
    return fetch({
        url: '/api/hallSystem/hikvision/getDoorEventsHistory',
        method: 'get',
        params: query
    });
}