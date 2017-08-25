import {fetchSys} from 'utils/fetch';

export function getMetadataTypeList(query) {
    return fetchSys({
        url: '/sysMetadataType/list',
        method: 'get',
        params: query
    });
}

export function getMetadataTypeTree() {
    return fetchSys({
        url: '/sysMetadataType/getTree',
        method: 'get'
    });
}

export function getMetadataTypeCascader(id) {
    return fetchSys({
        url: '/sysMetadataType/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetchSys({
        url: '/sysMetadataType/add',
        method: 'post',
        data
    })
}

export function updateMetadataType(sysMetadataTypeVo){
    const data = sysMetadataTypeVo;
    return fetchSys({
        url: '/sysMetadataType/edit',
        method: 'post',
        data
    })
}
export function delMetadataType(id) {
    const data = {id};
    return fetchSys({
        url: '/sysMetadataType/del',
        method: 'post',
        data
    })
}

export function deleteMetadataType(id) {
    const data = {id};
    return fetchSys({
        url: '/sysMetadataType/delete',
        method: 'post',
        data
    })
}




