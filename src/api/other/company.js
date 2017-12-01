import fetch from 'utils/fetch';

export function getZwfwCompanyList(query) {
    return fetch({
        url: '/api/zwfw/Company/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCompany(zwfwCompanyVo){
    const data = zwfwCompanyVo;
    return fetch({
        url: '/api/zwfw/Company/add',
        method: 'post',
        data
    })
}

export function updateZwfwCompany(zwfwCompanyVo){
    const data = zwfwCompanyVo;
    return fetch({
        url: '/api/zwfw/Company/edit',
        method: 'post',
        data
    })
}
export function delZwfwCompanys(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/Company/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCompany(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Company/delete',
        method: 'post',
        data
    })
}
export function getAllCompany(query) {
    return fetch({
        url: '/api/hallSystem/legalPerson/getAll',
        method: 'get',
        params: query
    })
}

