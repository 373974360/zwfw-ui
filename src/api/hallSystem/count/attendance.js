import fetch from 'utils/fetch';

export function getAttClockRecords(query) {
    return fetch({
        url: '/api/hallSystem/attendance/getAttClockRecords',
        method: 'get',
        params: query
    });
}