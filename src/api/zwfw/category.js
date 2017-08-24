import {fetchZwfw} from 'utils/fetch';

export function getCategoryList(query) {
    return fetchZwfw({
        url: '/zwfwCategory/list',
        method: 'get',
        params: query
    });
}

export function getCategoryTree() {
    return fetchZwfw({
        url: '/zwfwCategory/getTree',
        method: 'get'
    });
}

export function getCategoryCascader(id) {
    return fetchZwfw({
        url: '/zwfwCategory/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetchZwfw({
        url: '/zwfwCategory/add',
        method: 'post',
        data
    })
}

export function updateCategory(zwfwCategoryVo) {
    const data = zwfwCategoryVo;
    return fetchZwfw({
        url: '/zwfwCategory/edit',
        method: 'post',
        data
    })
}
export function delCategory(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwCategory/del',
        method: 'post',
        data
    })
}

export function deleteCategory(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwCategory/delete',
        method: 'post',
        data
    })
}