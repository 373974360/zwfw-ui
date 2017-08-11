import fetchJob from 'utils/fetchJob';


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


