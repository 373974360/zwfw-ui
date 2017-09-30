import {fetchZwfw} from 'utils/fetch';

export function getZwfwItemProcessExtendTimeList(query) {
    return fetchZwfw({
        url: '/zwfwItemProcessExtendTime/list',
        method: 'get',
        params: query
    });
}

export function workAgree(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemProcessExtendTime/workAgree',
        method: 'post',
        data
    })
}
export function workDisagree(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemProcessExtendTime/workDisagree',
        method: 'post',
        data
    })
}



