import {fetchSys} from 'utils/fetch';

export function getDictIndexList(query) {
    return fetchSys({
        url: '/api/admin/sysDicIndex/getAll',
        method: 'get',
        params: query
    });
}

export function updateDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetchSys({
        url: '/api/admin/sysDicIndex/edit',
        method: 'post',
        data
    })
}

export function createDictIndex(sysDictIndex) {
    const data = sysDictIndex;
    return fetchSys({
        url: '/api/admin/sysDicIndex/add',
        method: 'post',
        data
    })
}

export function delDictIndex(ids) {
    const data = {ids};
    return fetchSys({
        url: '/api/admin/sysDicIndex/dels',
        method: 'post',
        data
    })
}


export function getDictList(query) {
    return fetchSys({
        url: '/api/admin/sysDic/getAll',
        method: 'get',
        params: query
    });
}

export function updateDict(sysDict) {
    const data = sysDict;
    return fetchSys({
        url: '/api/admin/sysDic/edit',
        method: 'post',
        data
    })
}

export function createDict(sysDict) {
    const data = sysDict;
    return fetchSys({
        url: '/api/admin/sysDic/add',
        method: 'post',
        data
    })
}

export function delDict(ids) {
    const data = {ids};
    return fetchSys({
        url: '/api/admin/sysDic/dels',
        method: 'post',
        data
    })
}

