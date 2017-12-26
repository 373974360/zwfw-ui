import fetch from 'utils/fetch';

export function getJobLinkList(query) {
    return fetch({
        url: '/api/jobSystem/jobLink/list',
        method: 'get',
        params: query
    });
}

export function createJobLink(jobLinkVo){
    const data = jobLinkVo;
    return fetch({
        url: '/api/jobSystem/jobLink/add',
        method: 'post',
        data
    })
}

export function updateJobLink(jobLinkVo){
    const data = jobLinkVo;
    return fetch({
        url: '/api/jobSystem/jobLink/edit',
        method: 'post',
        data
    })
}
export function delJobLinks(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobLink/dels',
        method: 'post',
        data
    })
}
export function deleteJobLink(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobLink/delete',
        method: 'post',
        data
    })
}


export function getAllJobLinkTypeList(query) {
    return fetch({
        url: '/api/jobSystem/jobLinkType/getAll',
        method: 'get',
        params: query
    });
}


