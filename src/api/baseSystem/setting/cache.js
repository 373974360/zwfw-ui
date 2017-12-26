import fetch from 'utils/fetch';

export function getCacheList(query) {
    return fetch({
        url: '/api/baseSystem/setting/cache/list',
        method: 'get',
        params: query
    });
}


export function editCache(key,value) {
    const data = {key,value};
    return fetch({
        url: '/api/baseSystem/setting/cache/edit',
        method: 'post',
        data
    })
}

export function delCache(keys) {
    const data = {keys};
    return fetch({
        url: '/api/baseSystem/setting/cache/del',
        method: 'post',
        data
    })
}

export function flushCache() {
    return fetch({
        url: '/api/baseSystem/setting/cache/flush',
        method: 'post'
    })
}

