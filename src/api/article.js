import {fetchSys} from 'utils/fetch';

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

