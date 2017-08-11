import fetchJob from 'utils/fetchJob';

export function getPersonalList(query) {
    return fetchJob({
        url: '/jobPersonal/list',
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




