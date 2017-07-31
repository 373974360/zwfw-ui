import fetch from 'utils/fetch';

export function getDictIndexList(query) {
    return fetch({
        url: '/sysDicIndex/getAll',
        method: 'get',
        params: query
    });
}

export function updateDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetch({
        url: '/sysDicIndex/edit',
        method: 'post',
        data
    })
}

export function createDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetch({
        url: '/sysDicIndex/add',
        method: 'post',
        data
    })
}

export function delDictIndex(ids) {
    const data = {ids};
    return fetch({
        url: '/sysDicIndex/dels',
        method: 'post',
        data
    })
}


export function getDictList(query) {
    return fetch({
        url: '/sysDic/getAll',
        method: 'get',
        params: query
    });
}

export function updateDict(sysDict) {
    const data = sysDict;
    return fetch({
        url: '/sysDic/edit',
        method: 'post',
        data
    })
}

export function createDict(sysDict) {
    const data = sysDict;
    return fetch({
        url: '/sysDic/add',
        method: 'post',
        data
    })
}

export function delDict(ids) {
    const data = {ids};
    return fetch({
        url: '/sysDic/dels',
        method: 'post',
        data
    })
}

