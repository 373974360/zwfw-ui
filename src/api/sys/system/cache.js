import {fetchSys} from 'utils/fetch';

export function getCacheList(query) {
    return fetchSys({
        url: '/sysRedisCache/list',
        method: 'get',
        params: query
    });
}


export function editCache(key,value) {
    const data = {key,value};
    return fetchSys({
        url: '/sysRedisCache/edit',
        method: 'post',
        data
    })
}

export function delCache(keys) {
    const data = {keys};
    return fetchSys({
        url: '/sysRedisCache/del',
        method: 'post',
        data
    })
}

export function flushCache() {
    return fetchSys({
        url: '/sysRedisCache/flush',
        method: 'post'
    })
}

