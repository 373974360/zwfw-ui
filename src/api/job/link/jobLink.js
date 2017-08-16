import fetchJob from 'utils/fetchJob';

export function getJobLinkList(query) {
    return fetchJob({
        url: '/jobLink/list',
        method: 'get',
        params: query
    });
}

export function createJobLink(jobLinkVo){
    const data = jobLinkVo;
    return fetchJob({
        url: '/jobLink/add',
        method: 'post',
        data
    })
}

export function updateJobLink(jobLinkVo){
    const data = jobLinkVo;
    return fetchJob({
        url: '/jobLink/edit',
        method: 'post',
        data
    })
}
export function delJobLinks(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobLink/dels',
        method: 'post',
        data
    })
}
export function deleteJobLink(id) {
    const data = {id};
    return fetchJob({
        url: '/jobLink/delete',
        method: 'post',
        data
    })
}


export function getAllJobLinkTypeList(query) {
    return fetchJob({
        url: '/jobLinkType/getAll',
        method: 'get',
        params: query
    });
}


