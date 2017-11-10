import fetch from 'utils/fetch';

export function getZwfwItemList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/item/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/item/add',
        method: 'post',
        data
    })
}

export function updateZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/item/edit',
        method: 'post',
        data
    })
}
export function delZwfwItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfwSystem/business/item/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItem(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfwSystem/business/item/delete',
        method: 'post',
        data
    })
}
export function getAllByNameOrbasicCode(query) {
    return fetch({
        url: '/api/zwfwSystem/business/item/getAll',
        method: 'get',
        params: query
    })
}



