import fetch from 'utils/fetch';


export function getZnflTree() {
    return fetch({
        url: '/api/jobSystem/jobZnfl/getTree',
        method: 'get'
    });
}

export function getZnflCascader(id) {
    return fetch({
        url: '/api/jobSystem/jobZnfl/getCascader',
        method: 'get',
        params: {id}
    });
}


export function createZnfl(jobZnflVo) {
    const data = jobZnflVo;
    return fetch({
        url: '/api/jobSystem/jobZnfl/add',
        method: 'post',
        data
    })
}

export function updateZnfl(jobZnflVo) {
    const data = jobZnflVo;
    return fetch({
        url: '/api/jobSystem/jobZnfl/edit',
        method: 'post',
        data
    })
}


export function delZnfl(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobZnfl/del',
        method: 'post',
        data
    })
}