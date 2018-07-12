import fetch from 'utils/fetch';

/**
 * 查询表单
 * @param materialId 材料 id
 */
export function getFormByMaterialId(materialId) {
    return fetch({
        url: '/api/zwfwSystem/business/itemPretrialForm/getFormByMaterialId',
        method: 'get',
        params: {materialId}
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
 * 发布表单
 * @param data
 */
export function publishForm(data) {
    return fetch({
        url: '/api/zwfwSystem/business/itemPretrialForm/publish',
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