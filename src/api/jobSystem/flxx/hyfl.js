import fetch from 'utils/fetch';


export function getHyflTree() {
    return fetch({
        url: '/api/jobSystem/jobHyfl/getTree',
        method: 'get'
    });
}

export function getHyflCascader(id) {
    return fetch({
        url: '/api/jobSystem/jobHyfl/getCascader',
        method: 'get',
        params: {id}
    });
}


export function createHyfl(jobHyflVo) {
    const data = jobHyflVo;
    return fetch({
        url: '/api/jobSystem/jobHyfl/add',
        method: 'post',
        data
    })
}

export function updateHyfl(jobHyflVo) {
    const data = jobHyflVo;
    return fetch({
        url: '/api/jobSystem/jobHyfl/edit',
        method: 'post',
        data
    })
}


export function delHyfl(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobHyfl/del',
        method: 'post',
        data
    })
}