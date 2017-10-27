import fetch from 'utils/fetch';

export function getAllZwfwNaturePerson(query) {
    return fetch({
        url: '/api/zwfw/NaturePerson/getAll',
        method: 'get',
        params: query
    });
}

export function getZwfwNaturePersonList(query) {
    return fetch({
        url: '/api/zwfw/NaturePerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/zwfw/NaturePerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetch({
        url: '/api/zwfw/NaturePerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwNaturePersons(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/NaturePerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwNaturePerson(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/NaturePerson/delete',
        method: 'post',
        data
    })
}


