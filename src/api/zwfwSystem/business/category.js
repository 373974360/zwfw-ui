import fetch from 'utils/fetch';

export function getCategoryList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/category/list',
        method: 'get',
        params: query
    });
}

export function getCategoryTree() {
    return fetch({
        url: '/api/zwfwSystem/business/category/getTree',
        method: 'get'
    });
}

export function getCategoryCascader(id) {
    return fetch({
        url: '/api/zwfwSystem/business/category/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfwSystem/business/category/add',
        method: 'post',
        data
    })
}

export function updateCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/zwfwSystem/business/category/edit',
        method: 'post',
        data
    })
}
export function delCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfwSystem/business/category/del',
        method: 'post',
        data
    })
}

export function deleteCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfwSystem/business/category/delete',
        method: 'post',
        data
    })
}

export function getAllCategory() {
    return fetch({
        url: '/api/zwfwSystem/business/category/getAll',
        mothod: 'get'
    });
}

export function getCategoryListByPid(parentId) {
    return fetch({
        url: '/api/zwfwSystem/business/category/getCategoryList',
        method: 'get',
        params: {parentId}
    });
}