import {fetchJob} from 'utils/fetch';

export function getJobMemberLevelList(query) {
    return fetchJob({
        url: '/jobMemberLevel/list',
        method: 'get',
        params: query
    });
}

export function createJobMemberLevel(jobMemberLevelVo){
    const data = jobMemberLevelVo;
    return fetchJob({
        url: '/jobMemberLevel/add',
        method: 'post',
        data
    })
}

export function updateJobMemberLevel(jobMemberLevelVo){
    const data = jobMemberLevelVo;
    return fetchJob({
        url: '/jobMemberLevel/edit',
        method: 'post',
        data
    })
}
export function delJobMemberLevels(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobMemberLevel/dels',
        method: 'post',
        data
    })
}
export function deleteJobMemberLevel(id) {
    const data = {id};
    return fetchJob({
        url: '/jobMemberLevel/delete',
        method: 'post',
        data
    })
}


