import fetchZwfw from 'utils/fetchZwfw';

export function getZwfwMaterialList(query) {
    return fetchZwfw({
        url: '/zwfwMaterial/list',
        method: 'get',
        params: query
    });
}

export function createZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetchZwfw({
        url: '/zwfwMaterial/add',
        method: 'post',
        data
    })
}

export function updateZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetchZwfw({
        url: '/zwfwMaterial/edit',
        method: 'post',
        data
    })
}
export function delZwfwMaterials(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwMaterial/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwMaterial(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwMaterial/delete',
        method: 'post',
        data
    })
}


