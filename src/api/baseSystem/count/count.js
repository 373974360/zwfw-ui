/**
 * Created by deya-01 on 2017/11/17.
 */
import fetch from 'utils/fetch';

/**
 * 业务审批统计---待审批、办理中、已办结
 * @param query
 */
export function dataPlotProcessCount() {
    return fetch({
        url: '/api/yl12345/count/statistics/dataPlotProcessCount',
        method: 'get'
    })
}
/**
 *超期件、整改件、督办件
 * @param query
 */
export function dataPlotFlagByProcess(query) {
    return fetch({
        url: '/api/yl12345/count/statistics/dataPlotFlagByProcess',
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
        url: '/api/yl12345/count/statistics/dataPlotBusinessByProcess',
        method: 'get',
        params: query
    })
}