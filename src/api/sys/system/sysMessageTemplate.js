import {fetchSys} from 'utils/fetch';

export function getSysMessageTemplateList() {
    return fetchSys({
        url: '/sysMessageTemplate/list',
        method: 'get'
    });
}

export function createSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetchSys({
        url: '/sysMessageTemplate/add',
        method: 'post',
        data
    })
}

export function updateSysMessageTemplate(sysMessageTemplateVo){
    const data = sysMessageTemplateVo;
    return fetchSys({
        url: '/sysMessageTemplate/edit',
        method: 'post',
        data
    })
}

export function deleteSysMessageTemplate(template_id) {
    const data = {template_id};
    return fetchSys({
        url: '/sysMessageTemplate/delete',
        method: 'post',
        data
    })
}


