import fetch from 'utils/fetch';


export function getZyflTree() {
    return fetch({
        url: '/api/jobSystem/jobZyfl/getTree',
        method: 'get'
    });
}

export function getZyflCascader(id) {
    return fetch({
        url: '/api/jobSystem/jobZyfl/getCascader',
        method: 'get',
        params: {id}
    });
}


export function createZyfl(jobZyflVo) {
    const data = jobZyflVo;
    return fetch({
        url: '/api/jobSystem/jobZyfl/add',
        method: 'post',
        data
    })
}

export function updateZyfl(jobZyflVo) {
    const data = jobZyflVo;
    return fetch({
        url: '/api/jobSystem/jobZyfl/edit',
        method: 'post',
        data
    })
}


export function delZyfl(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobZyfl/del',
        method: 'post',
        data
    })
}