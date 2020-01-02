import fetch from 'utils/fetch';

export function getDetail(id) {
    return fetch({
        url: '/api/evaluate/detail/getByDetail',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateDetail(detailVo){
    const data = detailVo;
    return fetch({
        url: '/api/evaluate/detail/saveOrUpdate',
        method: 'post',
        data: data
    })
}

export function delDetail(id) {
    const data = {id};
    return fetch({
        url: '/api/evaluate/detail/removeByDetail',
        method: 'post',
        data: data
    })
}
export function delDetails(ids) {
    const data = {ids};
    return fetch({
        url: '/api/evaluate/detail/removeByIds',
        method: 'post',
        data: data
    })
}
export function getDetailList(query) {
    return fetch({
        url: '/api/evaluate/detail/pageByDetail',
        method: 'get',
        params: query
    });
}

export function getReplyDetailList(query) {
    return fetch({
        url: '/api/evaluate/detail/pageReplyByDetail',
        method: 'get',
        params: query
    });
}

export function saveReply(detailVo){
    const data = detailVo;
    return fetch({
        url: '/api/evaluate/detail/saveReply',
        method: 'post',
        data: data
    })
}

export function getStatistics(query) {
    return fetch({
        url: '/api/evaluate/detail/getStatistics',
        method: 'get',
        params: query
    });
}



export function poorInvalidAudit(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/poorInvalidAudit',
        method: 'post',
        data: detailVo
    })
}

export function reformChange(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/reformChange',
        method: 'post',
        data: detailVo
    })
}

export function unchangedAudit(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/unchangedAudit',
        method: 'post',
        data: detailVo
    })
}

export function reformDelay(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/reformDelay',
        method: 'post',
        data: detailVo
    })
}

export function reformDelayAudit(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/reformDelayAudit',
        method: 'post',
        data: detailVo
    })
}

export function queryEvaluateRecordList(detailId) {
    return fetch({
        url: '/api/evaluate/detail/queryEvaluateRecordList',
        method: 'get',
        params: {detailId}
    })
}

export function reformRevisit(detailVo) {
    return fetch({
        url: '/api/evaluate/detail/reformRevisit',
        method: 'post',
        data: detailVo
    })
}

