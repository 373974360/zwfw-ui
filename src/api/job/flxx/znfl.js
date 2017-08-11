import fetchJob from 'utils/fetchJob';


export function getZnflTree() {
    return fetchJob({
        url: '/jobZnfl/getTree',
        method: 'get'
    });
}

export function getZnflCascader(id) {
    return fetchJob({
        url: '/jobZnfl/getCascader',
        method: 'get',
        params:{id}
    });
}


export function createZnfl(jobZnflVo) {
    const data = jobZnflVo;
    return fetchJob({
        url: '/jobZnfl/add',
        method: 'post',
        data
    })
}

export function updateZnfl(jobZnflVo) {
    const data = jobZnflVo;
    return fetchJob({
        url: '/jobZnfl/edit',
        method: 'post',
        data
    })
}


export function delZnfl(id) {
    const data = {id};
    return fetchJob({
        url: '/jobZnfl/del',
        method: 'post',
        data
    })
}