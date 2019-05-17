import fetch from 'utils/fetch';

export function getOrganZpxxList(query) {
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/list',
        method: 'get',
        params: query
    });
}

export function delOrganZpxx(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/dels',
        method: 'post',
        data
    });
}

export function resetOrganZpxx(data) {
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/reset',
        method: 'post',
        data
    });
}

export function createZpxx(zpxxVo) {
    const data = zpxxVo;
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/add',
        method: 'post',
        data
    })
}

export function updateZpxx(zpxxVo) {
    const data = zpxxVo;
    return fetch({
        url: '/api/jobSystem/jobOrganZpxx/edit',
        method: 'post',
        data
    })
}