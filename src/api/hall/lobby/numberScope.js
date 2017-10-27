import fetch from 'src/utils/fetch';

export function getNumberScopeList(query) {
    return fetch({
        url: '/api/zwfw/NumberScope/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetch({
        url: '/api/zwfw/NumberScope/add',
        method: 'post',
        data
    })
}

export function updateZwfwNumberScope(zwfwNumberScopeVo) {
    const data = zwfwNumberScopeVo;
    return fetch({
        url: '/api/zwfw/NumberScope/edit',
        method: 'post',
        data
    })
}
export function delZwfwNumberScope(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/NumberScope/dels',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScope(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/NumberScope/delete',
        method: 'post',
        data
    })
}

export function getAllItemNumberScope(query) {
    return fetch({
        url: '/api/zwfw/NumberScopeItem/getAll',
        method: 'get',
        params: query
    })
}

export function createZwfwNumberScopeItem(zwfwNumberScopeItemVo) {
    const data = zwfwNumberScopeItemVo;
    return fetch({
        url: '/api/zwfw/NumberScopeItem/add',
        method: 'post',
        data
    })
}

export function deleteZwfwNumberScopeItem(numberScopeId, ids) {
    const data = {numberScopeId, ids};
    return fetch({
        url: '/api/zwfw/NumberScopeItem/delete',
        method: 'post',
        data
    })
}

