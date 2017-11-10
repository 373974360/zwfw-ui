import fetch from 'utils/fetch';

export function getZwfwItemProcessExtendTimeList(query) {
    return fetch({
        url: '/api/workSystem/itemProcessExtendTime/list',
        method: 'get',
        params: query
    });
}

export function workAgree(id) {
    const data = {id};
    return fetch({
        url: '/api/workSystem/itemProcessExtendTime/workAgree',
        method: 'post',
        data
    })
}
export function workDisagree(id) {
    const data = {id};
    return fetch({
        url: '/api/workSystem/itemProcessExtendTime/workDisagree',
        method: 'post',
        data
    })
}



