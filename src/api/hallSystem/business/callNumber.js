import fetch from 'utils/fetch';

export function getCallNumberList(query) {
    return fetch({
        url: '/api/hallSystem/hallCallItemNumber/list',
        method: 'get',
        params: query
    });
}