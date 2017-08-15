import fetchJob from 'utils/fetchJob';

export function getJobTzggList(query) {
    return fetchJob({
        url: '/jobTzgg/list',
        method: 'get',
        params: query
    });
}

export function createJobTzgg(jobTzggVo){
    const data = jobTzggVo;
    return fetchJob({
        url: '/jobTzgg/add',
        method: 'post',
        data
    })
}

export function updateJobTzgg(jobTzggVo){
    const data = jobTzggVo;
    return fetchJob({
        url: '/jobTzgg/edit',
        method: 'post',
        data
    })
}
export function delJobTzggs(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobTzgg/dels',
        method: 'post',
        data
    })
}
export function deleteJobTzgg(id) {
    const data = {id};
    return fetchJob({
        url: '/jobTzgg/delete',
        method: 'post',
        data
    })
}


