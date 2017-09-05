import {fetchZwfw} from 'utils/fetch';


/**
 * 根据流程定义和任务key返回任务设置
 * @param processDefinitionId
 * @param taskDefinitionKey
 * @returns {*}
 */
export function getOtherSetting(processDefinitionId,
                                taskDefinitionKey) {
    const data = {
        processDefinitionId, taskDefinitionKey
    };
    return fetchZwfw({
        url: '/zwfwItemProcess/getOtherSetting',
        method: 'get',
        params: data
    });
}

/**
 * 保存任务设置
 * @param data
 * @returns {*}
 */
export function saveOtherSetting(data) {
    return fetchZwfw({
        url: '/zwfwItemProcess/saveOtherSetting',
        method: 'post',
        params: data
    });
}

/**
 * 查询任务上分配的用户信息
 * @param processDefinitionId
 * @param taskDefinitionKey
 * @returns {*}
 */
export function getTaskUsers(processDefinitionId, taskDefinitionKey) {
    const data = {
        processDefinitionId, taskDefinitionKey
    };
    return fetchZwfw({
        url: '/zwfwItemProcess/getTaskUsers',
        method: 'get',
        params: data
    });
}

/**
 * 保存流程中任务的人员
 * @param processDefinitionId
 * @param taskDefinitionKey
 * @param users
 * @returns {*}
 */
export function saveCandidateUser(processDefinitionId,
                                  taskDefinitionKey,
                                  users) {
    const data = {
        processDefinitionId, taskDefinitionKey, users
    };
    return fetchZwfw({
        url: '/zwfwItemProcess/saveCandidateUser',
        method: 'post',
        params: data
    });
}

/**
 * 返回流程列表
 * @returns {*}
 */
export function getProcessList() {
    return fetchZwfw({
        url: '/zwfwItemProcess/getProcessList',
        method: 'get'
    })
}

/**
 * 根据流程key查询流程的所有版本列表
 * @param processDefinitionKey
 * @returns {*}
 */
export function getProcessVersionList(processDefinitionKey) {
    const data = {processDefinitionKey}
    return fetchZwfw({
        url: '/zwfwItemProcess/getProcessVersionList',
        method: 'get',
        params: data
    });
}

/**
 * 返回所有用户的列表，供前台选择用户
 * @returns {*}
 */
export function getUserList() {
    const data = {}
    return fetchZwfw({
        url: '/zwfwItemProcess/getUserList',
        method: 'get',
        params: data
    });
}

