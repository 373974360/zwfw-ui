import fetch from 'utils/fetch';

export function getAllZwfwLegalPerson(query) {
    return fetch({
        url: '/api/zwfw/legalPerson/getAll',
        method: 'get',
        params: query
    });
}

export function getZwfwLegalPersonList(query) {
    return fetch({
        url: '/api/zwfw/legalPerson/list',
        method: 'get',
        params: query
    });
}

export function createZwfwLegalPerson(zwfwLegalPersonVo){
    const data = zwfwLegalPersonVo;
    return fetch({
        url: '/api/zwfw/legalPerson/add',
        method: 'post',
        data
    })
}

export function updateZwfwLegalPerson(zwfwLegalPersonVo){
    const data = zwfwLegalPersonVo;
    return fetch({
        url: '/api/zwfw/legalPerson/edit',
        method: 'post',
        data
    })
}
export function delZwfwLegalPersons(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/legalPerson/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwLegalPerson(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/legalPerson/delete',
        method: 'post',
        data
    })
}


