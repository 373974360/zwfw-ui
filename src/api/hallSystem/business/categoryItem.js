import fetch from 'utils/fetch';

export function getZwfwCategoryItemList(query) {
    return fetch({
        url: '/api/hallSystem/business/categoryItem/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/hallSystem/business/categoryItem/add',
        method: 'post',
        data
    })
}

export function updateZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/hallSystem/business/categoryItem/edit',
        method: 'post',
        data
    })
}
export function delZwfwCategoryItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/business/categoryItem/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCategoryItem(categoryId, ids) {
    const data = {categoryId, ids};
    return fetch({
        url: '/api/hallSystem/business/categoryItem/delete',
        method: 'post',
        data
    })
}
export function getAllCategoeyItem(categoryId) {
    return fetch({
        url: '/api/hallSystem/business/categoryItem/getAll',
        method: 'get',
        params: {categoryId}
    })
}

export function getAllPageList(query) {
    return fetch({
        url: '/api/hallSystem/business/categoryItem/getAllPageList',
        method: 'get',
        params: query
    })
}


