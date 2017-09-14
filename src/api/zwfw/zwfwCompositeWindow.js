import {fetchZwfw} from 'utils/fetch';

/**
 * 模拟抽号-根据预审号码抽号
 * @param query
 * @returns {*}
 */
export function takeNumberByPretrialNumber(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/mockGetNumber',
        method: 'post',
        params: query
    });
}

/**
 * 模拟抽号-根据事项代码抽号
 * @param query
 * @returns {*}
 */
export function takeNumberByItemCode(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/mockGetNumber',
        method: 'post',
        params: query
    })
}

/**
 * 根据呼叫号查询号码
 * @param query
 * @returns {*}
 */
export function queryNumberByCallNumber(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/query',
        method: 'post',
        params: query
    })
}

/**
 * 查询当前窗口正在办理业务的号码
 * @param query
 * @returns {*}
 */
export function queryCurrentNumber(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/query',
        method: 'post',
        params: query
    })
}

/**
 * 登录到窗口
 * @param query
 * @returns {*}
 */
export function loginToWindow(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/loginToWindow',
        method: 'post',
        params: query
    })
}

/**
 * 叫号
 * @param query
 * @returns {*}
 */
export function callNumber(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/callNumber',
        method: 'post',
        params: query
    });
}

/**
 * 欢迎
 * @param query
 * @returns {*}
 */
export function welcomeNumber(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/welcomeNumber',
        method: 'post',
        params: query
    });
}

/**
 * 综合窗口提交收件
 * */
export function submitWork(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/submitWork',
        method: 'post',
        params: query
    });
}
