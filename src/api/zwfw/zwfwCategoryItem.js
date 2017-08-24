import {fetchZwfw} from 'utils/fetch';

export function getZwfwCategoryItemList(query) {
    return fetchZwfw({
        url: '/zwfwCategoryItem/list',
        method: 'get',
        params: query
    });
}

export function createZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetchZwfw({
        url: '/zwfwCategoryItem/add',
        method: 'post',
        data
    })
}

export function updateZwfwCategoryItem(zwfwCategoryItemVo){
    const data = zwfwCategoryItemVo;
    return fetchZwfw({
        url: '/zwfwCategoryItem/edit',
        method: 'post',
        data
    })
}
export function delZwfwCategoryItems(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwCategoryItem/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwCategoryItem(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwCategoryItem/delete',
        method: 'post',
        data
    })
}


