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
