import fetch from 'utils/fetch';


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
    return fetch({
        url: '/api/workSystem/itemProcess/getOtherSetting',
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
    return fetch({
        url: '/api/workSystem/itemProcess/saveOtherSetting',
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
    return fetch({
        url: '/api/workSystem/itemProcess/getTaskUsers',
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
    return fetch({
        url: '/api/workSystem/itemProcess/saveCandidateUser',
        method: 'post',
        params: data
    });
}

/**
 * 返回流程列表
 * @returns {*}
 */
export function getProcessList() {
    return fetch({
        url: '/api/workSystem/itemProcess/getProcessList',
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
    return fetch({
        url: '/api/workSystem/itemProcess/getProcessVersionList',
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
    return fetch({
        url: '/api/workSystem/itemProcess/getUserList',
        method: 'get',
        params: data
    });
}

export function getFinishList(query) {
    return fetch({
        url: '/api/workSystem/hallCompositeWindowCert/finish_list',
        method: 'get',
        params: query
    });
}

export function updateTake(query) {
    const data = query;
    return fetch({
        url: '/api/workSystem/hallCompositeWindowCert/update_take',
        method: 'post',
        data
    })
}

