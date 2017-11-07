import fetch from 'utils/fetch';

export function getZwfwItemMaterialList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItemMaterial(zwfwItemMaterialVo){
    const data = zwfwItemMaterialVo;
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/add',
        method: 'post',
        data
    })
}

export function updateZwfwItemMaterial(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/edit',
        method: 'post',
        data
    })
}
export function delZwfwItemMaterial(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItemMaterial(itemId, ids) {
    const data = {itemId, ids};
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/delete',
        method: 'post',
        data
    })
}
export function getAllItemMaterial(itemId) {
    return fetch({
        url: '/api/zwfwSystem/business/itemMaterial/getAll',
        method: 'get',
        params: {itemId}
    })
}


