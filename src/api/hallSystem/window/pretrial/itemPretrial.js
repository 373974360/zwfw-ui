import fetch from 'utils/fetch';

export function getZwfwItemPretrialList(query) {
    return fetch({
        url: '/api/workSystem/itemPretrial/list',
        method: 'get',
        params: query
    });
}

export function getPretrialDetail(id) {
    return fetch({
        url: '/api/workSystem/itemPretrial/getPretrialDetail',
        method: 'get',
        params: {id}
    });
}

export function getZwfwItemPretrialCascader(id) {
    return fetch({
        url: '/api/workSystem/itemPretrial/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createZwfwItemPretrial(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/workSystem/itemPretrial/add',
        method: 'post',
        data
    })
}

export function submitReview(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/workSystem/ItemPretrial/submitReview',
        method: 'post',
        data
    })
}
export function delZwfwItemPretrial(id) {
    const data = {id};
    return fetch({
        url: '/api/workSystem/ItemPretrial/del',
        method: 'post',
        data
    })
}

export function deleteZwfwItemPretrial(id) {
    const data = {id};
    return fetch({
        url: '/api/workSystem/Category/delete',
        method: 'post',
        data
    })
}

export function getAllZwfwItemPretrial() {
    return fetch({
        url: '/api/workSystem/Category/getAll',
        mothod: 'get'
    });
}
