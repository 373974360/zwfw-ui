import fetch from 'utils/fetch';

export function getZwfwItemList(query) {
    return fetch({
        url: '/api/zwfwSystem/business/item/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/item/add',
        method: 'post',
        data
    })
}

export function updateZwfwItem(zwfwItemVo) {
    const data = zwfwItemVo;
    return fetch({
        url: '/api/zwfwSystem/business/item/edit',
        method: 'post',
        data
    })
}

export function delZwfwItems(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfwSystem/business/item/dels',
        method: 'post',
        data
    });
}

export function deleteZwfwItem(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfwSystem/business/item/delete',
        method: 'post',
        data
    });
}

export function getAllByNameOrbasicCode(query) {
    return fetch({
        url: '/api/zwfwSystem/business/item/getAll',
        method: 'get',
        params: query
    })
}

/**
 * 根据事项id查询预审用户列表
 * @param itemId
 */
export function getPretrialUserListByItemId(itemId) {
    const data = {
        itemId: itemId
    };
    return fetch({
        url: '/api/zwfwSystem/business/item/getPretrialUser',
        method: 'get',
        params: data
    });
}

/**
 * 更新事项的预审用户列表
 * @param itemId
 * @param userIds
 */
export function updatePretrialUserList(itemId, userIds) {
    const data = {
        itemId: itemId,
        userIds: userIds
    };
    return fetch({
        url: '/api/zwfwSystem/business/item/updatePretrialUser',
        method: 'post',
        params: data
    });
}


export function getDetailById(id) {
    return fetch({
        url: '/api/zwfwSystem/business/item/get',
        method: 'get',
        params: {id: id}
    })
}

export function getItemConfig(itemId) {
    return fetch({
        url: '/api/zwfwSystem/item/getPreorderconfig',
        method: 'get',
        params: {itemId: itemId}
    })
}

export function setItemConfig(zwfwItemConfig) {
    const data = zwfwItemConfig;
    return fetch({
        url: '/api/zwfwSystem/item/setPreorderconfig',
        method: 'post',
        params: data
    })
}
