import {fetchZwfw} from 'utils/fetch';

export function getZwfwItemPretrialList(query) {
    return fetchZwfw({
        url: '/zwfwItemPretrial/list',
        method: 'get',
        params: query
    });
}

export function getPretrialDetail(id) {
    return fetchZwfw({
        url: '/zwfwItemPretrial/getPretrialDetail',
        method: 'get',
        params: {id}
    });
}

export function getZwfwItemPretrialCascader(id) {
    return fetchZwfw({
        url: '/zwfwItemPretrial/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createZwfwItemPretrial(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetchZwfw({
        url: '/zwfwItemPretrial/add',
        method: 'post',
        data
    })
}

export function submitReview(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetchZwfw({
        url: '/zwfwItemPretrial/submitReview',
        method: 'post',
        data
    })
}
export function delZwfwItemPretrial(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemPretrial/del',
        method: 'post',
        data
    })
}

export function deleteZwfwItemPretrial(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwCategory/delete',
        method: 'post',
        data
    })
}

export function getAllZwfwItemPretrial() {
    return fetchZwfw({
        url: '/zwfwCategory/getAll',
        mothod: 'get'
    });
}