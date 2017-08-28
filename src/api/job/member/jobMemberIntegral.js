import {fetchJob} from 'utils/fetch';

export function getJobMemberIntegralList(query) {
    return fetchJob({
        url: '/jobMemberIntegral/list',
        method: 'get',
        params: query
    });
}

export function createJobMemberIntegral(jobMemberIntegralVo){
    const data = jobMemberIntegralVo;
    return fetchJob({
        url: '/jobMemberIntegral/add',
        method: 'post',
        data
    })
}

export function updateJobMemberIntegral(jobMemberIntegralVo){
    const data = jobMemberIntegralVo;
    return fetchJob({
        url: '/jobMemberIntegral/edit',
        method: 'post',
        data
    })
}
export function delJobMemberIntegrals(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobMemberIntegral/dels',
        method: 'post',
        data
    })
}
export function deleteJobMemberIntegral(id) {
    const data = {id};
    return fetchJob({
        url: '/jobMemberIntegral/delete',
        method: 'post',
        data
    })
}


