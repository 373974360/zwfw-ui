import fetch from 'utils/fetch';

export function getNumberEntryList(query) {
    return fetch({
        url: '/api/hallSystem/numberEntry/list',
        method: 'get',
        params: query
    });
}

export function createNumberEntry(numberEntryVo) {
    const data = numberEntryVo;
    return fetch({
        url: '/api/hallSystem/numberEntry/add',
        method: 'post',
        data
    })
}

export function updateNumberEntry(numberEntryVo) {
    const data = numberEntryVo;
    return fetch({
        url: '/api/hallSystem/numberEntry/edit',
        method: 'post',
        data
    })
}

