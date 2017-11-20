/**
 * Created by deya-01 on 2017/11/17.
 */
import fetch from 'utils/fetch';


/**
 * 部门受理量
 * @param query
 */
export function dataPlotByDept(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotByDept',
        method: 'get',
        params: query
    });
}
/**
 * 部门受理平均等待时长
 * @param query
 */
export function dataPlotAvgBydeptId(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotAvgBydeptId',
        method: 'get',
        params: query
    });
}/**
 * 窗口受理量
 * @param query
 */
export function dataPlotByWindow(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotByWindow',
        method: 'get',
        params: query
    });
}/**
 * 窗口受理平均等待时长
 * @param query
 */
export function dataPlotAvgByWindowId(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotAvgByWindowId',
        method: 'get',
        params: query
    });
}/**
 * 五星级服务员
 * @param query
 */
export function getPlotFiveStarByUser(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/PlotFiveStarByUser',
        method: 'get',
        params: query
    });
}/**
 * 部门满意度
 * @param query
 */
export function dataPlotSatisfactionLevelByDept(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotSatisfactionLevelByDept',
        method: 'get',
        params: query
    });
}/**
 * 窗口满意度
 * @param query
 */
export function dataPlotSatisfactionLevelByWindow(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotSatisfactionLevelByWindow',
        method: 'get',
        params: query
    });
}/**
 * 业务审批统计---待审批
 * @param query
 */
export function dataPlotPendingByPretrial(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotPendingByPretrial',
        method: 'get',
        params: query
    });
}/**
 * 业务审批统计---办理中、已办结
 * @param query
 */
export function dataPlotHandleByProcess(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotHandleByProcess',
        method: 'get',
        params: query
    });
}
/**
 *超期件、整改件、督办件
 * @param query
 */
export function dataPlotFlagByProcess(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotflagByProcess',
        method: 'get',
        params: query
    });
}

/**
 * 业务量、超期率、正常办结率
 * @param query
 */
export function dataPlotBusinessByProcess(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotBusinessByProcess',
        method: 'get',
        params: query
    })
}

/**
 * 时间段内排队数、等待时长业务审批统计---办理中、已办结
 * @param query
 */
export function dataPlotCountByHour(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotCountByHour',
        method: 'get',
        params: query
    });
}


/**
 * 查询窗口等待事件排行
 * @param query
 */
export function dataPlotTopWaitWindow(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotTopWaitWindow',
        method: 'get',
        params: query
    });
}

/**
 * 查询事项等待事件排行
 * @param query
 */
export function dataPlotTopWaitItem(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotTopWaitItem',
        method: 'get',
        params: query
    });
}
