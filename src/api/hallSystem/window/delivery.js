import fetch from 'utils/fetch';

/**
 * 查询办件完成的列表
 * @param query
 */
export function getFinishList(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindowCert/finish_list',
        method: 'get',
        params: query
    });
}

export function addProcessOffline(itemProcessOfflineVo, memberVo) {
    const data = Object.assign(itemProcessOfflineVo, memberVo);
    return fetch({
        url: '/api/hallSystem/hallCompositeWindowCert/addProcessOffline',
        method: 'post',
        data
    })
}

export function deleteProcessOffline(processNumber) {
    const data = {processNumber};
    return fetch({
        url: '/api/hallSystem/hallCompositeWindowCert/deleteProcessOffline',
        method: 'post',
        data
    })
}

export function saveTakeType(takeTypeInfo) {
    const data = takeTypeInfo;
    return fetch({
        url: '/api/workSystem/itemTakeType/saveTakeType',
        method: 'post',
        data
    });
}

export function saveExpressInfo(expressInfo) {
    const data = expressInfo;
    return fetch({
        url: '/api/workSystem/itemTakeType/saveExpressInfo',
        method: 'post',
        data
    });
}

export function complete(takeTypeId) {
    const data = {takeTypeId};
    return fetch({
        url: '/api/workSystem/itemTakeType/complete',
        method: 'post',
        data
    });
}

export function reserve(processNumber) {
    const data = {processNumber};
    return fetch({
        url: '/api/workSystem/itemTakeType/mailboxReserve',
        method: 'post',
        data
    })
}

export function cancelReserve(processNumber) {
    const data = {processNumber};
    return fetch({
        url: '/api/workSystem/itemTakeType/mailboxCancelReserve',
        method: 'post',
        data
    });
}

export function getOrderStatus(mailboxOrderId) {
    const data = {mailboxOrderId};
    return fetch({
        url: '/api/mailbox/request/getOrderStatus',
        method: 'post',
        data
    })
}

export function getOrderDetail(mailboxOrderId) {
    const data = {mailboxOrderId};
    return fetch({
        url: '/api/mailbox/request/getOrderDetail',
        method: 'post',
        data
    });
}