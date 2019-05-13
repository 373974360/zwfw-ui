import fetch from 'utils/fetch';

export function getHandMailboxOpenCode(processNumber) {
    return fetch({
        url: '/api/workSystem/itemHandType/getOpenCode',
        method: 'get',
        params: {processNumber}
    });
}

export function mailboxPostMailRequest(processNumber) {
    const data = {processNumber}
    return fetch({
        url: '/api/workSystem/itemHandType/mailboxPostMailRequest',
        method: 'post',
        data
    });
}
