import fetch from 'utils/fetch';

export function getMetadataTypeList(query) {
    return fetch({
        url: '/api/admin/sysMetadataType/list',
        method: 'get',
        params: query
    });
}

export function getMetadataTypeTree() {
    return fetch({
        url: '/api/admin/sysMetadataType/getTree',
        method: 'get'
    });
}

export function getMetadataTypeCascader(id) {
    return fetch({
        url: '/api/admin/sysMetadataType/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/api/admin/sysMetadataType/add',
        method: 'post',
        data
    })
}

export function updateMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/api/admin/sysMetadataType/edit',
        method: 'post',
        data
    })
}
export function delMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/api/admin/sysMetadataType/del',
        method: 'post',
        data
    })
}

export function deleteMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/api/admin/sysMetadataType/delete',
        method: 'post',
        data
    })
}




