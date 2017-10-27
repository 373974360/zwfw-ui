import fetch from 'utils/fetch';

export function getZwfwItemMaterialList(query) {
    return fetch({
        url: '/api/zwfw/ItemMaterial/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItemMaterial(zwfwItemMaterialVo){
    const data = zwfwItemMaterialVo;
    return fetch({
        url: '/api/zwfw/ItemMaterial/add',
        method: 'post',
        data
    })
}

export function updateZwfwItemMaterial(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfw/ItemMaterial/edit',
        method: 'post',
        data
    })
}
export function delZwfwItemMaterial(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/ItemMaterial/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItemMaterial(itemId, ids) {
    const data = {itemId, ids};
    return fetch({
        url: '/api/zwfw/ItemMaterial/delete',
        method: 'post',
        data
    })
}
export function getAllItemMaterial(itemId) {
    return fetch({
        url: '/api/zwfw/ItemMaterial/getAll',
        method: 'get',
        params: {itemId}
    })
}


