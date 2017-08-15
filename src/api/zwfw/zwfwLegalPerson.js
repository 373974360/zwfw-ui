import fetchZwfw from 'utils/fetchZwfw';

export function getZwfwLegalPersonList(query) {
    return fetchZwfw({
        url: '/zwfwLegalPerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwLegalPerson(zwfwLegalPersonVo){
    const data = zwfwLegalPersonVo;
    return fetchZwfw({
        url: '/zwfwLegalPerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwLegalPerson(zwfwLegalPersonVo){
    const data = zwfwLegalPersonVo;
    return fetchZwfw({
        url: '/zwfwLegalPerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwLegalPersons(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwLegalPerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwLegalPerson(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwLegalPerson/delete',
        method: 'post',
        data
    })
}


