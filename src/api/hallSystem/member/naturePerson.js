import fetch from 'utils/fetch';

export function getAllZwfwNaturePerson(query) {
    return fetch({
        url: '/api/zwfw/naturePerson/getAll',
        method: 'get',
        params: query
    });
}

export function getZwfwNaturePersonList(query) {
    return fetch({
        url: '/api/zwfw/naturePerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/zwfw/naturePerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/zwfw/naturePerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwNaturePersons(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/naturePerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwNaturePerson(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/naturePerson/delete',
        method: 'post',
        data
    })
}


