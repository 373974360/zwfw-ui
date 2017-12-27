import fetch from 'utils/fetch';

export function getJobMemberIntegralList(query) {
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/list',
        method: 'get',
        params: query
    });
}

export function createJobMemberIntegral(jobMemberIntegralVo){
    const data = jobMemberIntegralVo;
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/add',
        method: 'post',
        data
    })
}

export function updateJobMemberIntegral(jobMemberIntegralVo){
    const data = jobMemberIntegralVo;
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/edit',
        method: 'post',
        data
    })
}
export function delJobMemberIntegrals(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/dels',
        method: 'post',
        data
    })
}
export function deleteJobMemberIntegral(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobMemberIntegral/delete',
        method: 'post',
        data
    })
}


