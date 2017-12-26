import fetch from 'utils/fetch';

/**
 * 模拟抽号-根据预审号码抽号
 * @param query
 * @returns {*}
 */
export function takeNumberByProcessNumber(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/mockGetNumber',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/mockGetNumber',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/query',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/query',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/loginToWindow',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/callNumber',
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
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/welcomeNumber',
        method: 'post',
        params: query
    });
}

/**
 * 综合窗口提交收件
 * */
export function submitWork(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/submitWork',
        method: 'post',
        params: query
    });
}

/**
 * 查询企业信息
 * @param query
 */
export function queryCompanyInfo(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/queryCompanyInfo',
        method: 'post',
        params: query
    });
}
/**
 * 分页查询企业信息
 * @param query
 */
export function queryCompanysInfo(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/queryCompanysInfo',
        method: 'post',
        params: query
    });
}

/**
 * 查询事项信息和办件材料列表
 * @param query
 */
export function getItemInfo(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/getItemInfo',
        method: 'post',
        params: query
    });
}

/**
 * 综合窗口提交非预审的收件
 * */
export function submitNoPretrial(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/submitNoPretrial',
        method: 'post',
        params: query
    });
}

/**
 * 查询当前登录的后台用户用户登录的窗口
 */
export function getCurrentUserLoginedWindow() {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/getCurrentUserLoginedWindow',
        method: 'post',
        params: {}
    });
}

/**
 * 检测用户是否有账号
 * @param query
 */
export function checkMemberExist(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/checkMemberExist',
        method: 'post',
        params: query
    });
}

/**
 * 获取快速注册手机验证码
 * @param query
 */
export function sendFastRegPhoneCode(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/sendFastRegPhoneCode',
        method: 'post',
        params: query
    });
}

/**
 * 快速注册会员账号，后台会验证验证码，如果手机验证码不正确会注册失败
 * @param query
 */
export function fastRegMember(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/fastRegMember',
        method: 'post',
        params: query
    });
}
