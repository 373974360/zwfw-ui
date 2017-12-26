import fetch from 'utils/fetch';

export function getMetadataTypeList(query) {
    return fetch({
        url: '/api/baseSystem/data/metadataType/list',
        method: 'get',
        params: query
    });
}

export function getMetadataTypeTree() {
    return fetch({
        url: '/api/baseSystem/data/metadataType/getTree',
        method: 'get'
    });
}

export function getMetadataTypeCascader(id) {
    return fetch({
        url: '/api/baseSystem/data/metadataType/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/api/baseSystem/data/metadataType/add',
        method: 'post',
        data
    })
}

export function updateMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/api/baseSystem/data/metadataType/edit',
        method: 'post',
        data
    })
}
export function delMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/data/metadataType/del',
        method: 'post',
        data
    })
}

export function deleteMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/data/metadataType/delete',
        method: 'post',
        data
    })
}




