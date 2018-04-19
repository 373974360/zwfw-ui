import fetch from 'utils/fetch';

/**
 * 查询表单
 * @param itemId 事项 id
 */
export function getFormByItemId(itemId) {
    return fetch({
        url: '/api/zwfwSystem/business/itemPretrialForm/getFormByItemId',
        method: 'get',
        params: {itemId}
    });
}

/**
 * 更新表单
 * @param data 表单和表单域信息
 */
export function updateForm(data) {
    return fetch({
        url: '/api/zwfwSystem/business/itemPretrialForm/update',
        method: 'post',
        data
    });
}

/**
 *  根据条件查询field自动完成列表
 * @param query
 */
export function suggestField(query) {
    return fetch({
        url: '/api/zwfwSystem/business/itemPretrialForm/suggestField',
        method: 'get',
        params: query
    })
}