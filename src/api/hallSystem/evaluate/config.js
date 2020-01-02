import fetch from 'utils/fetch';

export function getConfig(id) {
    return fetch({
        url: '/api/evaluate/config/getByConfig',
        method: 'get',
        params: {id}
    })
}

export function createOrUpdateConfig(configVo){
    return fetch({
        url: '/api/evaluate/config/saveOrUpdate',
        method: 'post',
        data: configVo
    })
}

export function delConfig(id) {
    const data = {id};
    return fetch({
        url: '/api/evaluate/config/removeByConfig',
        method: 'post',
        data: data
    })
}
export function delConfigs(ids) {
    const data = {ids};
    return fetch({
        url: '/api/evaluate/config/removeByIds',
        method: 'post',
        data: data
    })
}
export function getConfigList(query) {
    return fetch({
        url: '/api/evaluate/config/pageByConfig',
        method: 'get',
        params: query
    });
}

export function getEvaluateConfig(query) {
    return fetch({
        url: '/api/evaluate/config/getEvaluateConfig',
        method: 'get',
        params: query
    });
}

export function delConfigsByLevel(levels) {
    const data = {levels};
    return fetch({
        url: '/api/evaluate/config/removeByLevels',
        method: 'post',
        data: data
    })
}
