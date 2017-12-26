import fetch from 'utils/fetch';

export function getJobAdTypeList(query) {
    return fetch({
        url: '/api/jobSystem/jobAdType/list',
        method: 'get',
        params: query
    });
}

export function createJobAdType(jobAdTypeVo) {
    const data = jobAdTypeVo;
    return fetch({
        url: '/api/jobSystem/jobAdType/add',
        method: 'post',
        data
    })
}

export function updateJobAdType(jobAdTypeVo) {
    const data = jobAdTypeVo;
    return fetch({
        url: '/api/jobSystem/jobAdType/edit',
        method: 'post',
        data
    })
}
export function delJobAdTypes(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobAdType/dels',
        method: 'post',
        data
    })
}
export function deleteJobAdType(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobAdType/delete',
        method: 'post',
        data
    })
}


