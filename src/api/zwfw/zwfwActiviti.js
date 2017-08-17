import fetchZwfwActiviti from 'utils/fetchZwfwActiviti';
import _ from 'lodash'

/**
 * 流程模型列表接口
 * @param query
 */
export function getZwfwActivitiModelList(query) {
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/list',
        method: 'get',
        params: query
    });
}

/**
 * 流程模型编辑URL获取
 * @param id
 */
export function getZwfwActivitiModelEditUrl(id) {
    const data = {id};
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/getEditUrl',
        method: 'get',
        params: data
    });
}

/**
 * 创建新的流程模型
 * @param data
 */
export function createZwfwActivitiModel(data) {
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/add',
        method: 'post',
        params: data
    });
}

/**
 * 删除流程模型
 * @param id
 */
export function deleteZwfwActivitiModel(id) {
    const data = {id:_.isArray(id) ? id.join('#') : id};
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/delete',
        method: 'post',
        params: data
    });
}
