import fetch from 'utils/fetch';

export function getZwfwItemList(query) {
    return fetch({
        url: '/api/zwfw/Item/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfw/Item/add',
        method: 'post',
        data
    })
}

export function updateZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfw/Item/edit',
        method: 'post',
        data
    })
}
export function delZwfwItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/Item/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItem(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Item/delete',
        method: 'post',
        data
    })
}
export function getAllByNameOrbasicCode(query) {
    return fetch({
        url: '/api/zwfw/Item/getAll',
        method: 'get',
        params: query
    })
}



