import fetch from 'utils/fetch';

export function getJobLinkTypeList(query) {
    return fetch({
        url: '/api/jobSystem/jobLinkType/list',
        method: 'get',
        params: query
    });
}

export function createJobLinkType(jobLinkTypeVo){
    const data = jobLinkTypeVo;
    return fetch({
        url: '/api/jobSystem/jobLinkType/add',
        method: 'post',
        data
    })
}

export function updateJobLinkType(jobLinkTypeVo){
    const data = jobLinkTypeVo;
    return fetch({
        url: '/api/jobSystem/jobLinkType/edit',
        method: 'post',
        data
    })
}
export function delJobLinkTypes(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobLinkType/dels',
        method: 'post',
        data
    })
}
export function deleteJobLinkType(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobLinkType/delete',
        method: 'post',
        data
    })
}


