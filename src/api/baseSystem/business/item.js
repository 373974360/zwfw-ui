import fetch from 'utils/fetch';

export function getZwfwItemList(query) {
    return fetch({
        url: '/api/yl12345/business/item/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/yl12345/business/item/add',
        method: 'post',
        data
    })
}

export function updateZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/yl12345/business/item/edit',
        method: 'post',
        data
    })
}

export function delZwfwItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/yl12345/business/item/dels',
        method: 'post',
        data
    });
}

export function deleteZwfwItem(id) {
    const data = {id};
    return fetch({
        url: '/api/yl12345/business/item/delete',
        method: 'post',
        data
    });
}

export function getAllByNameOrbasicCode(query) {
    return fetch({
        url: '/api/yl12345/business/item/getAll',
        method: 'get',
        params: query
    })
}

export function getDetailById(id) {
    return fetch({
        url: '/api/yl12345/business/item/get',
        method: 'get',
        params: {id: id}
    })
}
