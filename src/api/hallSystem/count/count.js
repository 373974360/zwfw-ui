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
        url: '/api/hallSystem/count/statistics/plotFiveStarByUser',
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
}

/**
 * 业务审批统计---待审批、办理中、已办结
 * @param query
 */
export function dataPlotProcessCount() {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotProcessCount',
        method: 'get'
    })
}
/**
 *超期件、整改件、督办件
 * @param query
 */
export function dataPlotFlagByProcess(query) {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotFlagByProcess',
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

export function dataPlotQueueCount() {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataPlotQueueCount',
        method: 'get'
    })
}

/**
 * 时间段内排队数、等待时长
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

/**
 * 当天抽号信息
 * @param query
 */
export function getDataNumberCount() {
    return fetch({
        url: '/api/hallSystem/count/statistics/dataNumberCount',
        method: 'get'
    });
}

/**
 * 叫号
 */
export function jiaohao(windowId) {
    const data = {windowId}
    return fetch({
        url: '/api/hallSystem/count/statistics/jiaohao',
        method: 'post',
        data
    });
}

/**
 * 今日、历史累计受理量、比上一工作日增长/下降百分比
 * 等待时长、等待人数、交件、取件数
 */
export function getAcceptCount() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getAcceptCount',
        method: 'get'
    })
}

/**
 * 窗口受理情况
 */
export function getWindowsRealTimeAccept() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getWindowsRealTimeAccept',
        method: 'get'
    })
}
/**
 * 各窗口业务受理量
 */
export function getRealTimeAcceptCountByWindow() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getRealTimeAcceptCountByWindow',
        method: 'get'
    })
}

/**
 * 本周热门业务Top5
 */
export function getThisWeekHotBusiness() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getThisWeekHotBusiness',
        method: 'get'
    })
}

/**
 * 本月热门业务Top5
 */
export function getThisMonthHotBusiness() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getThisMonthHotBusiness',
        method: 'get'
    })
}

/**
 * 各业务窗口实时等待情况
 */
export function getRealWaitTimeByWindow() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getRealWaitTimeByWindow',
        method: 'get'
    })
}
export function getAdmissibilityAndWaitTimeAtHours() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getAdmissibilityAndWaitTimeAtHours',
        method: 'get'
    })
}

// 本月预审量、办理中事项、本月办结事项
export function getItemAcceptCount() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getItemAcceptCount',
        method: 'get'
    })
}
// 窗口满意度Top
export function getSatisfactionTop10() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getSatisfactionTop10',
        method: 'get'
    })
}
// 热门事项正常办结率Top10
export function getTopItemFinishRate() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getTopItemFinishRate',
        method: 'get'
    })
}
// 实时审批进度
export function getRealTimeApproveSchedule() {
    return fetch({
        url: '/api/hallSystem/count/statistics/getRealTimeApproveSchedule',
        method: 'get'
    })
}


