import fetch from 'utils/fetch';

export function getZwfwItemProcessExtendTimeList(query) {
    return fetch({
        url: '/api/zwfw/ItemProcessExtendTime/list',
        method: 'get',
        params: query
    });
}

export function workAgree(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/ItemProcessExtendTime/workAgree',
        method: 'post',
        data
    })
}
export function workDisagree(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/ItemProcessExtendTime/workDisagree',
        method: 'post',
        data
    })
}



