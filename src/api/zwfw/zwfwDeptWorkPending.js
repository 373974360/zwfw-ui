import {fetchZwfw} from 'utils/fetch';

/**
 * 查询当前用户的待处理事项
 * @param type 类型，1=我的待处理任务，2=所有待处理任务
 * @param search 搜索关键字
 */
export function getZwfwDeptWorkPendingList(q) {

    return fetchZwfw({
        url: '/zwfwItemProcessWork/getZwfwDeptWorkPendingList',
        method: 'get',
        params: q
    });
}
