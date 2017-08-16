import fetchJob from 'utils/fetchJob';

export function getJobAdList(query) {
    return fetchJob({
        url: '/jobAd/list',
        method: 'get',
        params: query
    });
}

export function createJobAd(jobAdVo){
    const data = jobAdVo;
    return fetchJob({
        url: '/jobAd/add',
        method: 'post',
        data
    })
}

export function updateJobAd(jobAdVo){
    const data = jobAdVo;
    return fetchJob({
        url: '/jobAd/edit',
        method: 'post',
        data
    })
}
export function delJobAds(ids) {
    const data = {ids};
    return fetchJob({
        url: '/jobAd/dels',
        method: 'post',
        data
    })
}
export function deleteJobAd(id) {
    const data = {id};
    return fetchJob({
        url: '/jobAd/delete',
        method: 'post',
        data
    })
}



export function getAllJobAdTypeList(query) {
    return fetchJob({
        url: '/jobAdType/getAll',
        method: 'get',
        params: query
    });
}


