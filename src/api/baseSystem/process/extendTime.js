import fetch from 'utils/fetch';

export function getProcessExtendTimeList(query) {
    return fetch({
        url: '/api/yl12345/processExtendTime/list',
        method: 'get',
        params: query
    });
}

export function workAgree(id) {
    const data = {id};
    return fetch({
        url: '/api/yl12345/processExtendTime/workAgree',
        method: 'post',
        data
    })
}
export function workDisagree(id) {
    const data = {id};
    return fetch({
        url: '/api/yl12345/processExtendTime/workDisagree',
        method: 'post',
        data
    })
}



