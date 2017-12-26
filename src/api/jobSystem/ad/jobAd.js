import fetch from 'utils/fetch';

export function getJobAdList(query) {
    return fetch({
        url: '/api/jobSystem/jobAd/list',
        method: 'get',
        params: query
    });
}

export function createJobAd(jobAdVo) {
    const data = jobAdVo;
    return fetch({
        url: '/api/jobSystem/jobAd/add',
        method: 'post',
        data
    })
}

export function updateJobAd(jobAdVo) {
    const data = jobAdVo;
    return fetch({
        url: '/api/jobSystem/jobAd/edit',
        method: 'post',
        data
    })
}
export function delJobAds(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobAd/dels',
        method: 'post',
        data
    })
}
export function deleteJobAd(id) {
    const data = {id};
    return fetch({
        url: '/api/jobSystem/jobAd/delete',
        method: 'post',
        data
    })
}



export function getAllJobAdTypeList(query) {
    return fetch({
        url: '/api/jobSystem/jobAdType/getAll',
        method: 'get',
        params: query
    });
}


