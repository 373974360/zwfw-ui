import fetch from 'utils/fetch';

export function getAllZwfwNaturePerson(query) {
    return fetch({
        url: '/api/hallSystem/naturePerson/getAll',
        method: 'get',
        params: query
    });
}

export function getZwfwNaturePersonList(query) {
    return fetch({
        url: '/api/hallSystem/naturePerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/hallSystem/naturePerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/hallSystem/naturePerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwNaturePersons(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/naturePerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwNaturePerson(id) {
    const data = {id};
    return fetch({
        url: '/api/hallSystem/naturePerson/delete',
        method: 'post',
        data
    })
}

export function idCardExist(idcard) {
    return fetch({
        url: '/api/hallSystem/naturePerson/idCardExist',
        method: 'get',
        params: {idcard}
    })
}
