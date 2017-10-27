import fetch from 'utils/fetch';

export function getCacheList(query) {
    return fetch({
        url: '/api/admin/sysRedisCache/list',
        method: 'get',
        params: query
    });
}


export function editCache(key,value) {
    const data = {key,value};
    return fetch({
        url: '/api/admin/sysRedisCache/edit',
        method: 'post',
        data
    })
}

export function delCache(keys) {
    const data = {keys};
    return fetch({
        url: '/api/admin/sysRedisCache/del',
        method: 'post',
        data
    })
}

export function flushCache() {
    return fetch({
        url: '/api/admin/sysRedisCache/flush',
        method: 'post'
    })
}

