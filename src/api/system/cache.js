import fetch from 'utils/fetch';

export function getCacheList(query) {
    return fetch({
        url: '/sysRedisCache/list',
        method: 'get',
        params: query
    });
}


export function editCache(key,value) {
    const data = {key,value};
    return fetch({
        url: '/sysRedisCache/edit',
        method: 'post',
        data
    })
}

export function delCache(keys) {
    const data = {keys};
    return fetch({
        url: '/sysRedisCache/del',
        method: 'post',
        data
    })
}

export function flushCache() {
    return fetch({
        url: '/sysRedisCache/flush',
        method: 'post'
    })
}

