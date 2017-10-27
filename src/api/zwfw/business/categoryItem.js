import fetch from 'utils/fetch';

export function getZwfwCategoryItemList(query) {
    return fetch({
        url: '/api/zwfw/CategoryItem/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfw/CategoryItem/add',
        method: 'post',
        data
    })
}

export function updateZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetch({
        url: '/api/zwfw/CategoryItem/edit',
        method: 'post',
        data
    })
}
export function delZwfwCategoryItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/CategoryItem/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCategoryItem(categoryId, ids) {
    const data = {categoryId, ids};
    return fetch({
        url: '/api/zwfw/CategoryItem/delete',
        method: 'post',
        data
    })
}
export function getAllCategoeyItem(categoryId) {
    return fetch({
        url: '/api/zwfw/CategoryItem/getAll',
        method: 'get',
        params: {categoryId}
    })
}


