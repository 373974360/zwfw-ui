import fetch from 'utils/fetch';

export function getSysMessageTemplateList() {
    return fetch({
        url: '/api/admin/sysMessageTemplate/list',
        method: 'get'
    });
}

export function createSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetch({
        url: '/api/admin/sysMessageTemplate/add',
        method: 'post',
        data
    })
}

export function updateSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetch({
        url: '/api/admin/sysMessageTemplate/edit',
        method: 'post',
        data
    })
}

export function deleteSysMessageTemplate(template_id) {
    const data = {template_id};
    return fetch({
        url: '/api/admin/sysMessageTemplate/delete',
        method: 'post',
        data
    })
}


