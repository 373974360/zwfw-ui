import fetch from 'utils/fetch';

export function getZwfwMaterialList(query) {
    return fetch({
        url: '/api/zwfw/Material/list',
        method: 'get',
        params: query
    });
}

export function createZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetch({
        url: '/api/zwfw/Material/add',
        method: 'post',
        data
    })
}

export function updateZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetch({
        url: '/api/zwfw/Material/edit',
        method: 'post',
        data
    })
}
export function delZwfwMaterials(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/Material/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwMaterial(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Material/delete',
        method: 'post',
        data
    })
}
export function getAllMaterial(query) {
    return fetch({
        url: '/api/zwfw/Material/getAll',
        method: 'get',
        params: query
    })
}


