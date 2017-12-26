import fetch from 'utils/fetch';

export function getSysMessageTemplateList() {
    return fetch({
        url: '/api/baseSystem/data/messageTemplate/list',
        method: 'get'
    });
}

export function createSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetch({
        url: '/api/baseSystem/data/messageTemplate/add',
        method: 'post',
        data
    })
}

export function updateSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetch({
        url: '/api/baseSystem/data/messageTemplate/edit',
        method: 'post',
        data
    })
}

export function deleteSysMessageTemplate(template_id) {
    const data = {template_id};
    return fetch({
        url: '/api/baseSystem/data/messageTemplate/delete',
        method: 'post',
        data
    })
}


