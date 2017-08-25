import {fetchJob} from 'utils/fetch';

export function getJobMessageList(query) {
    return fetchJob({
        url: '/jobMessage/list',
        method: 'get',
        params: query
    });
}

export function createJobMessage(jobMessageVo){
    const data = jobMessageVo;
    return fetchJob({
        url: '/jobMessage/add',
        method: 'post',
        data
    })
}

export function updateJobMessage(jobMessageVo){
    const data = jobMessageVo;
    return fetchJob({
        url: '/jobMessage/edit',
        method: 'post',
        data
    })
}
export function delJobMessages(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobMessage/dels',
        method: 'post',
        data
    })
}
export function deleteJobMessage(id) {
    const data = {id};
    return fetchJob({
        url: '/jobMessage/delete',
        method: 'post',
        data
    })
}


