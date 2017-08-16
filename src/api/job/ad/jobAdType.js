import fetchJob from 'utils/fetchJob';

export function getJobAdTypeList(query) {
    return fetchJob({
        url: '/jobAdType/list',
        method: 'get',
        params: query
    });
}

export function createJobAdType(jobAdTypeVo){
    const data = jobAdTypeVo;
    return fetchJob({
        url: '/jobAdType/add',
        method: 'post',
        data
    })
}

export function updateJobAdType(jobAdTypeVo){
    const data = jobAdTypeVo;
    return fetchJob({
        url: '/jobAdType/edit',
        method: 'post',
        data
    })
}
export function delJobAdTypes(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobAdType/dels',
        method: 'post',
        data
    })
}
export function deleteJobAdType(id) {
    const data = {id};
    return fetchJob({
        url: '/jobAdType/delete',
        method: 'post',
        data
    })
}


