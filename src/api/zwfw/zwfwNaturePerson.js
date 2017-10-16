import {fetchZwfw} from 'utils/fetch';

export function getAllZwfwNaturePerson(query) {
    return fetchZwfw({
        url: '/zwfwNaturePerson/getAll',
        method: 'get',
        params: query
    });
}

export function getZwfwNaturePersonList(query) {
    return fetchZwfw({
        url: '/zwfwNaturePerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetchZwfw({
        url: '/zwfwNaturePerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwNaturePerson(zwfwNaturePersonVo) {
    const data = zwfwNaturePersonVo;
    return fetchZwfw({
        url: '/zwfwNaturePerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwNaturePersons(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwNaturePerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwNaturePerson(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwNaturePerson/delete',
        method: 'post',
        data
    })
}


