import fetch from 'utils/fetch';

export function getDicIndexList(query) {
    return fetch({
        url: '/api/baseSystem/data/dicIndex/getAll',
        method: 'get',
        params: query
    });
}

export function updateDicIndex(dicIndex) {
    const data = dicIndex;
    return fetch({
        url: '/api/baseSystem/data/dicIndex/edit',
        method: 'post',
        data
    })
}

export function createDicIndex(dicIndex) {
    const data = dicIndex;
    return fetch({
        url: '/api/baseSystem/data/dicIndex/add',
        method: 'post',
        data
    })
}

export function delDicIndex(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/data/dicIndex/dels',
        method: 'post',
        data
    })
}


export function getDictList(query) {
    return fetch({
        url: '/api/baseSystem/data/dic/getAll',
        method: 'get',
        params: query
    });
}

export function updateDict(dic) {
    const data = dic;
    return fetch({
        url: '/api/baseSystem/data/dic/edit',
        method: 'post',
        data
    })
}

export function createDict(dic) {
    const data = dic;
    return fetch({
        url: '/api/baseSystem/data/dic/add',
        method: 'post',
        data
    })
}

export function delDict(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/data/dic/dels',
        method: 'post',
        data
    })
}

