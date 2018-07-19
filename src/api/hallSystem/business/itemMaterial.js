import fetch from 'utils/fetch';

export function getZwfwItemMaterialList(query) {
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItemMaterial(zwfwItemMaterialVo){
    const data = zwfwItemMaterialVo;
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/add',
        method: 'post',
        data
    })
}

export function updateZwfwItemMaterial(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/edit',
        method: 'post',
        data
    })
}
export function delZwfwItemMaterial(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItemMaterial(itemId, ids) {
    const data = {itemId, ids};
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/delete',
        method: 'post',
        data
    })
}
export function getAllItemMaterial(itemId) {
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/getAll',
        method: 'get',
        params: {itemId}
    })
}

export function doUpdateAndRelate(zwfwItemMaterial){
    const data = zwfwItemMaterial;
    return fetch({
        url: '/api/hallSystem/business/itemMaterial/updateAndRelate',
        method: 'post',
        data
    })
}


