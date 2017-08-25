import {fetchJob} from 'utils/fetch';

export function getJobInfoCatalogTree() {
    return fetchJob({
        url: '/jobInfoCatalog/getTree',
        method: 'get'
    });
}

export function getJobInfoCatalogCascader(id) {
    return fetchJob({
        url: '/jobInfoCatalog/getCascader',
        method: 'get',
        params:{id}
    });
}
export function createJobInfoCatalog(jobInfoCatalogVo){
    const data = jobInfoCatalogVo;
    return fetchJob({
        url: '/jobInfoCatalog/add',
        method: 'post',
        data
    })
}

export function updateJobInfoCatalog(jobInfoCatalogVo){
    const data = jobInfoCatalogVo;
    return fetchJob({
        url: '/jobInfoCatalog/edit',
        method: 'post',
        data
    })
}
export function delJobInfoCatalog(id) {
    const data = {id};
    return fetchJob({
        url: '/jobInfoCatalog/del',
        method: 'post',
        data
    })
}


