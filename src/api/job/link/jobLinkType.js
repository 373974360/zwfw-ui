import {fetchJob} from 'utils/fetch';

export function getJobLinkTypeList(query) {
    return fetchJob({
        url: '/jobLinkType/list',
        method: 'get',
        params: query
    });
}

export function createJobLinkType(jobLinkTypeVo){
    const data = jobLinkTypeVo;
    return fetchJob({
        url: '/jobLinkType/add',
        method: 'post',
        data
    })
}

export function updateJobLinkType(jobLinkTypeVo){
    const data = jobLinkTypeVo;
    return fetchJob({
        url: '/jobLinkType/edit',
        method: 'post',
        data
    })
}
export function delJobLinkTypes(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobLinkType/dels',
        method: 'post',
        data
    })
}
export function deleteJobLinkType(id) {
    const data = {id};
    return fetchJob({
        url: '/jobLinkType/delete',
        method: 'post',
        data
    })
}


