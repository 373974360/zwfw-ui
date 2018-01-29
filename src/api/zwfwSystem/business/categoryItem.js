import fetch from 'utils/fetch';

export function getZwfwCategoryItemList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/add',
        method: 'post',
        data
    })
}

export function updateZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/edit',
        method: 'post',
        data
    })
}
export function delZwfwCategoryItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCategoryItem(categoryId, ids) {
    const data = {categoryId, ids};
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/delete',
        method: 'post',
        data
    })
}
export function getAllCategoeyItem(categoryId) {
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/getAll',
        method: 'get',
        params: {categoryId}
    })
}
export function getAllCategoeyItems(itemId) {
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/getAll',
        method: 'get',
        params: {itemId}
    })
}

export function getAllPageList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/getAllPageList',
        method: 'get',
        params: query
    })
}


export function createItemCategorys(itemId, categoryIds) {
    const data = {itemId, categoryIds};
    return fetch({
        url: '/api/zwfwSystem/business/categoryItem/addList',
        method: 'post',
        data
    })
}

