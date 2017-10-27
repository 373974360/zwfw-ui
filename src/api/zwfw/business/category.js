import fetch from 'utils/fetch';

export function getCategoryList(query) {
    return fetch({
        url: '/api/zwfw/Category/list',
        method: 'get',
        params: query
    });
}

export function getCategoryTree() {
    return fetch({
        url: '/api/zwfw/Category/getTree',
        method: 'get'
    });
}

export function getCategoryCascader(id) {
    return fetch({
        url: '/api/zwfw/Category/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfw/Category/add',
        method: 'post',
        data
    })
}

export function updateCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfw/Category/edit',
        method: 'post',
        data
    })
}
export function delCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Category/del',
        method: 'post',
        data
    })
}

export function deleteCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Category/delete',
        method: 'post',
        data
    })
}

export function getAllCategory() {
    return fetch({
        url: '/api/zwfw/Category/getAll',
        mothod: 'get'
    });
}