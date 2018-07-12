import fetch from 'utils/fetch';


export function createSum(itemProcessEntryVo) {
    const data = itemProcessEntryVo;
    return fetch({
        url: '/api/workSystem/itemProcessEntry/sumEntry',
        method: 'post',
        data
    })
}

export function updateSum(itemProcessEntryVo) {
    const data = itemProcessEntryVo;
    return fetch({
        url: '/api/workSystem/itemProcessEntry/updateSum',
        method: 'post',
        data
    })
}
export function getPolicyNumberByHours(query) {
    return fetch({
        url: '/api/workSystem/itemProcessEntry/getPolicyNumberByHours',
        method: 'get',
        params: query
    });
}