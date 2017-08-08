import fetchZwfw from 'utils/fetchZwfw';

export function getItemList(query) {
    return fetchZwfw({
        url: '/zwfwItemCategory/list',
        method: 'get',
        params: query
    });
}

export function getItemTree() {
    return fetchZwfw({
        url: '/zwfwItemCategory/getTree',
        method: 'get'
    });
}

export function getItemCascader(id) {
    return fetchZwfw({
        url: '/zwfwItemCategory/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createItem(zwfwItemCategoryVo) {
    const data = zwfwItemCategoryVo;
    return fetchZwfw({
        url: '/zwfwItemCategory/add',
        method: 'post',
        data
    })
}

export function updateItem(zwfwItemCategoryVo) {
    const data = zwfwItemCategoryVo;
    return fetchZwfw({
        url: '/zwfwItemCategory/edit',
        method: 'post',
        data
    })
}
export function delItem(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemCategory/del',
        method: 'post',
        data
    })
}

export function deleteItem(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItemCategory/delete',
        method: 'post',
        data
    })
}