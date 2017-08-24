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

export function getPersonal(query) {
    return fetchJob({
        url: '/jobPersonal/get',
        method: 'get',
        params: query
    });
}

export function getPersonalQzyx(query) {
    return fetchJob({
        url: '/jobPersonalQzyx/get',
        method: 'get',
        params: query
    });
}

export function getPersonalGzjl(query) {
    return fetchJob({
        url: '/jobPersonalGzjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalItem(query) {
    return fetchJob({
        url: '/jobPersonalItem/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalJyjl(query) {
    return fetchJob({
        url: '/jobPersonalJyjl/getAll',
        method: 'get',
        params: query
    });
}

export function getPersonalZs(query) {
    return fetchJob({
        url: '/jobPersonalZs/getAll',
        method: 'get',
        params: query
    });
}




