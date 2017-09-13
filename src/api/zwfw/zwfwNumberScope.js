import {fetchZwfw} from 'src/utils/fetch';

export function getNumberScopeList(query) {
    return fetchZwfw({
        url: '/zwfwNumberScope/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetchZwfw({
        url: '/zwfwNumberScope/add',
        method: 'post',
        data
    })
}

export function updateZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetchZwfw({
        url: '/zwfwNumberScope/edit',
        method: 'post',
        data
    })
}
export function delZwfwNumberScope(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwNumberScope/dels',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScope(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwNumberScope/delete',
        method: 'post',
        data
    })
}

export function getAllItemNumberScope(query) {
    return fetchZwfw({
        url: '/zwfwNumberScopeItem/getAll',
        method: 'get',
        params: query
    })
}

export function createZwfwNumberScopeItem(zwfwNumberScopeItemVo) {
    const data = zwfwNumberScopeItemVo;
    return fetchZwfw({
        url: '/zwfwNumberScopeItem/add',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScopeItem(numberScopeId, ids) {
    const data = {numberScopeId, ids};
    return fetchZwfw({
        url: '/zwfwNumberScopeItem/delete',
        method: 'post',
        data
    })
}

