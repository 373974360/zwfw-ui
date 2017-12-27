import fetch from 'utils/fetch';

export function getJobMessageList(query) {
    return fetch({
        url: '/api/jobSystem/jobMessage/list',
        method: 'get',
        params: query
    });
}

export function createJobMessage(jobMessageVo){
    const data = jobMessageVo;
    return fetch({
        url: '/api/jobSystem/jobMessage/add',
        method: 'post',
        data
    })
}

export function updateJobMessage(jobMessageVo){
    const data = jobMessageVo;
    return fetch({
        url: '/api/jobSystem/jobMessage/edit',
        method: 'post',
        data
    })
}
export function delJobMessages(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobMessage/dels',
        method: 'post',
        data
    })
}
export function deleteJobMessage(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobMessage/delete',
        method: 'post',
        data
    })
}


