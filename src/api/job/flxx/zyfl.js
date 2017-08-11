import fetchJob from 'utils/fetchJob';


export function getZyflTree() {
    return fetchJob({
        url: '/jobZyfl/getTree',
        method: 'get'
    });
}

export function getZyflCascader(id) {
    return fetchJob({
        url: '/jobZyfl/getCascader',
        method: 'get',
        params:{id}
    });
}


export function createZyfl(jobZyflVo) {
    const data = jobZyflVo;
    return fetchJob({
        url: '/jobZyfl/add',
        method: 'post',
        data
    })
}

export function updateZyfl(jobZyflVo) {
    const data = jobZyflVo;
    return fetchJob({
        url: '/jobZyfl/edit',
        method: 'post',
        data
    })
}


export function delZyfl(id) {
    const data = {id};
    return fetchJob({
        url: '/jobZyfl/del',
        method: 'post',
        data
    })
}