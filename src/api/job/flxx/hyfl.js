import {fetchJob} from 'utils/fetch';


export function getHyflTree() {
    return fetchJob({
        url: '/jobHyfl/getTree',
        method: 'get'
    });
}

export function getHyflCascader(id) {
    return fetchJob({
        url: '/jobHyfl/getCascader',
        method: 'get',
        params:{id}
    });
}


export function createHyfl(jobHyflVo) {
    const data = jobHyflVo;
    return fetchJob({
        url: '/jobHyfl/add',
        method: 'post',
        data
    })
}

export function updateHyfl(jobHyflVo) {
    const data = jobHyflVo;
    return fetchJob({
        url: '/jobHyfl/edit',
        method: 'post',
        data
    })
}


export function delHyfl(id) {
    const data = {id};
    return fetchJob({
        url: '/jobHyfl/del',
        method: 'post',
        data
    })
}