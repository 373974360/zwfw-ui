import fetch from 'utils/fetch';

export function getMailboxList(query) {
    return fetch({
        url: '/api/hallSystem/mailbox/list',
        method: 'get',
        params: query
    });
}

export function getAllMailbox(query) {
    return fetch({
        url: '/api/hallSystem/mailbox/getAll',
        method: 'get',
        params: query
    });
}

export function addMailbox(mailboxVo) {
    const data = mailboxVo;
    return fetch({
        url: '/api/hallSystem/mailbox/add',
        method: 'post',
        data
    });
}

export function updateMailbox(mailboxVo) {
    const data = mailboxVo;
    return fetch({
        url: '/api/hallSystem/mailbox/edit',
        method: 'post',
        data
    });
}

export function delMailboxes(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/mailbox/dels',
        method: 'post',
        data
    });
}

export function queryBoxStatus(deviceId) {
    return fetch({
        url: '/api/mailbox/request/boxStatus',
        method: 'get',
        params: {deviceId}
    });
}
