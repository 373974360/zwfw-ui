import fetch from 'src/utils/fetch';

export function getNumberScopeList(query) {
    return fetch({
        url: '/api/hallSystem/numberScope/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetch({
        url: '/api/hallSystem/numberScope/add',
        method: 'post',
        data
    })
}

export function updateZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetch({
        url: '/api/hallSystem/numberScope/edit',
        method: 'post',
        data
    })
}
export function delZwfwNumberScope(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/numberScope/dels',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScope(id) {
    const data = {id};
    return fetch({
        url: '/api/hallSystem/numberScope/delete',
        method: 'post',
        data
    })
}

export function getAllItemNumberScope(query) {
    return fetch({
        url: '/api/hallSystem/numberScopeItem/getAll',
        method: 'get',
        params: query
    })
}

export function createZwfwNumberScopeItem(zwfwNumberScopeItemVo) {
    const data = zwfwNumberScopeItemVo;
    return fetch({
        url: '/api/hallSystem/numberScopeItem/add',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScopeItem(numberScopeId, ids) {
    const data = {numberScopeId, ids};
    return fetch({
        url: '/api/hallSystem/numberScopeItem/delete',
        method: 'post',
        data
    })
}

