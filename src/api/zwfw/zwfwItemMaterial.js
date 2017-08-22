import fetchZwfw from 'utils/fetchZwfw';

export function getZwfwItemMaterialList(query) {
    return fetchZwfw({
        url: '/zwfwItemMaterial/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItemMaterial(zwfwItemMaterialVo){
    const data = zwfwItemMaterialVo;
    return fetchZwfw({
        url: '/zwfwItemMaterial/add',
        method: 'post',
        data
    })
}

export function updateZwfwItemMaterial(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetchZwfw({
        url: '/zwfwItemMaterial/edit',
        method: 'post',
        data
    })
}
export function delZwfwItemMaterial(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwItemMaterial/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItemMaterial(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemMaterial/delete',
        method: 'post',
        data
    })
}
export function getAllItemMaterial(itemId) {
    return fetchZwfw({
        url: '/zwfwItemMaterial/getAll',
        method: 'get',
        params: {itemId}
    })
}


