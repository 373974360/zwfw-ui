import fetch from 'utils/fetch';

export function getZwfwItemPretrialList(query) {
    return fetch({
        url: '/api/hallSystem/itemPretrial/list',
        method: 'get',
        params: query
    });
}

export function getPretrialDetail(id) {
    return fetch({
        url: '/api/hallSystem/itemPretrial/getPretrialDetail',
        method: 'get',
        params: {id}
    });
}

export function getZwfwItemPretrialCascader(id) {
    return fetch({
        url: '/api/hallSystem/itemPretrial/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createZwfwItemPretrial(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/hallSystem/itemPretrial/add',
        method: 'post',
        data
    })
}

export function submitReview(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/hallSystem/ItemPretrial/submitReview',
        method: 'post',
        data
    })
}
export function delZwfwItemPretrial(id) {
    const data = {id};
    return fetch({
        url: '/api/hallSystem/ItemPretrial/del',
        method: 'post',
        data
    })
}

export function deleteZwfwItemPretrial(id) {
    const data = {id};
    return fetch({
        url: '/api/hallSystem/Category/delete',
        method: 'post',
        data
    })
}

export function getAllZwfwItemPretrial() {
    return fetch({
        url: '/api/hallSystem/Category/getAll',
        mothod: 'get'
    });
}
