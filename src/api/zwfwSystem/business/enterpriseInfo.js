import fetch from 'utils/fetch';



export function getHymlOptions() {
    return fetch({
        url: '/api/zwfwSystem/business/enterpriseInfo/getHymlOptions',
        mothod: 'get'
    });
}
export function getHyOptions(hyml) {
    return fetch({
        url: '/api/zwfwSystem/business/enterpriseInfo/getHyOptions',
        mothod: 'get',
        params: {hyml}
    });
}
export function getQylbOptions() {
    return fetch({
        url: '/api/zwfwSystem/business/enterpriseInfo/getQylbOptions',
        mothod: 'get'
    });
}
export function getQylxOptions(qylb) {
    return fetch({
        url: '/api/zwfwSystem/business/enterpriseInfo/getQylxOptions',
        mothod: 'get',
        params: {qylb}
    });
}
