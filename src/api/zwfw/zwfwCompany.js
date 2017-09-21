import {fetchZwfw} from 'utils/fetch';

export function getZwfwCompanyList(query) {
    return fetchZwfw({
        url: '/zwfwCompany/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCompany(zwfwCompanyVo){
    const data = zwfwCompanyVo;
    return fetchZwfw({
        url: '/zwfwCompany/add',
        method: 'post',
        data
    })
}

export function updateZwfwCompany(zwfwCompanyVo){
    const data = zwfwCompanyVo;
    return fetchZwfw({
        url: '/zwfwCompany/edit',
        method: 'post',
        data
    })
}
export function delZwfwCompanys(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwCompany/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCompany(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwCompany/delete',
        method: 'post',
        data
    })
}
export function getAllCompany(query) {
    return fetchZwfw({
        url: '/zwfwCompany/getAll',
        method: 'get',
        params: query
    })
}

