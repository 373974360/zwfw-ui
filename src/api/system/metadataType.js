import fetch from 'utils/fetch';

export function getMetadataTypeList(query) {
    return fetch({
        url: '/sysMetadataType/list',
        method: 'get',
        params: query
    });
}

export function getMetadataTypeTree() {
    return fetch({
        url: '/sysMetadataType/getTree',
        method: 'get'
    });
}

export function getMetadataTypeCascader(id) {
    return fetch({
        url: '/sysMetadataType/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/sysMetadataType/add',
        method: 'post',
        data
    })
}

export function updateMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetch({
        url: '/sysMetadataType/edit',
        method: 'post',
        data
    })
}
export function delMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/sysMetadataType/del',
        method: 'post',
        data
    })
}

export function deleteMetadataType(id) {
    const data = {id};
    return fetch({
        url: '/sysMetadataType/delete',
        method: 'post',
        data
    })
}




