import fetch from 'utils/fetch';

export function getHandMailboxOpenCode(processNumber) {
    return fetch({
        url: '/api/workSystem/itemHandType/getOpenCode',
        method: 'get',
        params: {processNumber}
    });
}

export function expressRequest(processNumber) {
    const data = {processNumber}
    return fetch({
        url: '/api/workSystem/itemHandType/expressRequest',
        method: 'post',
        data
    });
}
