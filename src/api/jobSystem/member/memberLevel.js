import fetch from 'utils/fetch';

export function getJobMemberLevelList(query) {
    return fetch({
        url: '/api/jobSystem/jobMemberLevel/list',
        method: 'get',
        params: query
    });
}

export function createJobMemberLevel(jobMemberLevelVo){
    const data = jobMemberLevelVo;
    return fetch({
        url: '/api/jobSystem/jobMemberLevel/add',
        method: 'post',
        data
    })
}

export function updateJobMemberLevel(jobMemberLevelVo){
    const data = jobMemberLevelVo;
    return fetch({
        url: '/api/jobSystem/jobMemberLevel/edit',
        method: 'post',
        data
    })
}
export function delJobMemberLevels(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobMemberLevel/dels',
        method: 'post',
        data
    })
}
export function deleteJobMemberLevel(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobMemberLevel/delete',
        method: 'post',
        data
    })
}


