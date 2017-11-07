import fetch from 'utils/fetch';

export function getZwfwMaterialList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/material/list',
        method: 'get',
        params: query
    });
}

export function createZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetch({
        url: '/api/zwfwSystem/business/material/add',
        method: 'post',
        data
    })
}

export function updateZwfwMaterial(zwfwMaterialVo) {
    const data = zwfwMaterialVo;
    return fetch({
        url: '/api/zwfwSystem/business/material/edit',
        method: 'post',
        data
    })
}
export function delZwfwMaterials(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/material/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwMaterial(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/material/delete',
        method: 'post',
        data
    })
}
export function getAllMaterial(query) {
    return fetch({
        url: '/api/zwfw/material/getAll',
        method: 'get',
        params: query
    })
}


