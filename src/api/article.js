import fetchSys from 'utils/fetchSys';

export function getList() {
    return fetchSys({
        url: '/article/list',
        method: 'get'
    });
}

export function getArticle() {
    return fetchSys({
        url: '/article/detail',
        method: 'get'
    });
}

