import fetch from 'utils/fetch';

export function queryEvaluateCountByLevel() {
    return fetch({
        url: '/api/evaluate/count/qryEvaluateCountByLevel',
        method: 'get'
    })
}

export function queryEvaluateCountByChannel() {
    return fetch({
        url: '/api/evaluate/count/qryEvaluateCountByChannel',
        method: 'get'
    })
}

export function queryEvaluateCountByDept(detailVo) {
    return fetch({
        url: '/api/evaluate/count/qryEvaluateCountByDept',
        method: 'get',
        params: detailVo
    })
}

export function qryCountByDeptChannel(detailVo) {
    return fetch({
        url: '/api/evaluate/count/qryCountByDeptChannel',
        method: 'get',
        params: detailVo
    })
}

export function qryCountByDeptDimensionCode(detailVo) {
    return fetch({
        url: '/api/evaluate/count/qryCountByDeptDimensionCode',
        method: 'get',
        params: detailVo
    })
}

export function qryCountByDeptItemLevel(detailVo) {
    return fetch({
        url: '/api/evaluate/count/qryCountByDeptItemLevel',
        method: 'get',
        params: detailVo
    })
}

export function qryCountDeptReform(detailVo) {
    return fetch({
        url: '/api/evaluate/count/qryCountDeptReform',
        method: 'get',
        params: detailVo
    })
}

export function qryDeptSortByScore() {
    return fetch({
        url: '/api/evaluate/count/qryDeptSortByScore',
        method: 'get'
    })
}

export function qryDeptSortByCount() {
    return fetch({
        url: '/api/evaluate/count/qryDeptSortByCount',
        method: 'get'
    })
}

export function qryDeptSortByRateEvaluate() {
    return fetch({
        url: '/api/count/qryDeptSortByRateEvaluate',
        method: 'get'
    })
}

export function qryDeptSortByRatePoor() {
    return fetch({
        url: '/api/evaluate/count/qryDeptSortByRatePoor',
        method: 'get'
    })
}

export function qryDeptSortComposite() {
    return fetch({
        url: '/api/evaluate/count/qryDeptSortComposite',
        method: 'get'
    })
}
