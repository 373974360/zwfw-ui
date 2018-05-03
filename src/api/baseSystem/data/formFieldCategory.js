import fetch from 'utils/fetch';

export function getCategoryTree() {
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/getTree',
        method: 'get'
    });
}

export function getCategoryCascader(id) {
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/add',
        method: 'post',
        data
    })
}

export function updateCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/edit',
        method: 'post',
        data
    })
}
export function delCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/del',
        method: 'post',
        data
    })
}

export function deleteCategory(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/delete',
        method: 'post',
        data
    })
}

export function getAllCategory() {
    return fetch({
        url: '/api/baseSystem/data/formFieldCategory/getAll',
        mothod: 'get'
    });
}
