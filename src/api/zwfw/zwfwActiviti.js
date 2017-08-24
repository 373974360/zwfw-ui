import {fetchZwfwActiviti} from 'utils/fetch';
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
    return  '/static/modeler.html?modelId=' + id;
}

/**
 * 流程模型上传URL获取
 * @param id
 */
export function getZwfwActivitiModelUploadUrl() {
    return process.env.ZWFW_ACTIVITI_API + '/zwfw/activiti/model/upload';
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
    const data = {id: _.isArray(id) ? id.join('#') : id};
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/delete',
        method: 'post',
        params: data
    });
}

/**
 * 发布流程模型位流程定义
 * @param id
 */
export function deployZwfwActivitiModel(id) {
    const data = {id: _.isArray(id) ? id.join('#') : id};
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/deploy',
        method: 'post',
        params: data
    });
}

/**
 * 流程定义分页列表接口
 * @param listQuery
 */
export function getZwfwProcessDefinitionList(query) {
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/pd/list',
        method: 'get',
        params: query
    });
}

/**
 * 挂起流程
 * @param id
 */
export function suspendZwfwProcessDefinition(id) {

    const data = {id: _.isArray(id) ? id.join('#') : id};

    return fetchZwfwActiviti({
        url: '/zwfw/activiti/pd/suspend',
        method: 'post',
        params: data
    })
}

export function activeZwfwProcessDefinition(id) {

    const data = {id: _.isArray(id) ? id.join('#') : id};

    return fetchZwfwActiviti({
        url: '/zwfw/activiti/pd/active',
        method: 'post',
        params: data
    })
}
