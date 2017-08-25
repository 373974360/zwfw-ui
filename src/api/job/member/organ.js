import {fetchJob} from 'utils/fetch';


export function getOrganList(query) {
    return fetchJob({
        url: '/jobOrgan/list',
        method: 'get',
        params: query
    });
}

export function delMember(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobMember/dels',
        method: 'post',
        data
    })
}

export function getMember(query) {
    return fetchJob({
        url: '/jobOrgan/get',
        method: 'get',
        params: query
    });
}


