import {fetchSys} from 'utils/fetch';

export function getDictIndexList(query) {
    return fetchSys({
        url: '/sysDicIndex/getAll',
        method: 'get',
        params: query
    });
}

export function updateDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetchSys({
        url: '/sysDicIndex/edit',
        method: 'post',
        data
    })
}

export function createDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetchSys({
        url: '/sysDicIndex/add',
        method: 'post',
        data
    })
}

export function delDictIndex(ids) {
    const data = {ids};
    return fetchSys({
        url: '/sysDicIndex/dels',
        method: 'post',
        data
    })
}


export function getDictList(query) {
    return fetchSys({
        url: '/sysDic/getAll',
        method: 'get',
        params: query
    });
}

export function updateDict(sysDict) {
    const data = sysDict;
    return fetchSys({
        url: '/sysDic/edit',
        method: 'post',
        data
    })
}

export function createDict(sysDict) {
    const data = sysDict;
    return fetchSys({
        url: '/sysDic/add',
        method: 'post',
        data
    })
}

export function delDict(ids) {
    const data = {ids};
    return fetchSys({
        url: '/sysDic/dels',
        method: 'post',
        data
    })
}

