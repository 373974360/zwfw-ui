import fetch from 'utils/fetch';

export function getZwfwItemPretrialList(query) {
    return fetch({
        url: '/api/workSystem/itemPretrial/list',
        method: 'get',
        params: query
    });
}

export function getPretrialDetail(id) {
    return fetch({
        url: '/api/workSystem/itemPretrial/getPretrialDetail',
        method: 'get',
        params: {id}
    });
}

export function submitReview(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/workSystem/itemPretrial/submitReview',
        method: 'post',
        data
    })
}

