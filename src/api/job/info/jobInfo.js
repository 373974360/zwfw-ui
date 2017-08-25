import {fetchJob} from 'utils/fetch';

export function getJobInfoList(query) {
    return fetchJob({
        url: '/jobInfo/list',
        method: 'get',
        params: query
    });
}

export function createJobInfo(jobInfoVo){
    const data = jobInfoVo;
    return fetchJob({
        url: '/jobInfo/add',
        method: 'post',
        data
    })
}

export function updateJobInfo(jobInfoVo){
    const data = jobInfoVo;
    return fetchJob({
        url: '/jobInfo/edit',
        method: 'post',
        data
    })
}
export function delJobInfos(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobInfo/dels',
        method: 'post',
        data
    })
}
export function deleteJobInfo(id) {
    const data = {id};
    return fetchJob({
        url: '/jobInfo/delete',
        method: 'post',
        data
    })
}


