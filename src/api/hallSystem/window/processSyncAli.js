import fetch from 'utils/fetch';

export function getProcessSyncAli(projId) {
    return fetch({
        url: '/api/workSystem/itemProcessSyncALI/getByProjId',
        method: 'get',
        params: {projId}
    })
}

export function getItemMaterialsAli(sceneId) {
    return fetch({
        url: '/api/workSystem/itemProcessSyncALI/getItemMaterials',
        method: 'get',
        params: {sceneId}
    })
}

export function getItemMaterialsDefault(itemNo) {
    return fetch({
        url: '/api/workSystem/itemProcessSyncALI/getItemMaterialsDefault',
        method: 'get',
        params: {itemNo}
    })
}
