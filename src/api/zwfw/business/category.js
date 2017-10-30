import fetch from 'utils/fetch';

export function getCategoryList(query) {
    return fetch({
        url: '/api/zwfw/category/list',
        method: 'get',
        params: query
    });
}

export function getCategoryTree() {
    return fetch({
        url: '/api/zwfw/category/getTree',
        method: 'get'
    });
}

export function getCategoryCascader(id) {
    return fetch({
        url: '/api/zwfw/category/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfw/category/add',
        method: 'post',
        data
    })
}

export function updateCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfw/category/edit',
        method: 'post',
        data
    })
}
export function delCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/category/del',
        method: 'post',
        data
    })
}

export function deleteCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/category/delete',
        method: 'post',
        data
    })
}

export function getAllCategory() {
    return fetch({
        url: '/api/zwfw/category/getAll',
        mothod: 'get'
    });
}
