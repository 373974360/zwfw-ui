import fetch from 'utils/fetch';

export function getSysMessageFiledList(query) {
    return fetch({
        url: '/api/admin/sysMessageFiled/list',
        method: 'get',
        params: query
    });
}

export function getAllSysMessageFiled() {
    return fetch({
        url: '/api/admin/sysMessageFiled/getAll',
        method: 'get'
    });
}

export function createSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetch({
        url: '/api/admin/sysMessageFiled/add',
        method: 'post',
        data
    })
}

export function updateSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetch({
        url: '/api/admin/sysMessageFiled/edit',
        method: 'post',
        data
    })
}
export function delSysMessageFileds(ids) {
    const data = {ids};
    return fetch({
        url: '/api/admin/sysMessageFiled/dels',
        method: 'post',
        data
    })
}
export function deleteSysMessageFiled(id) {
    const data = {id};
    return fetch({
        url: '/api/admin/sysMessageFiled/delete',
        method: 'post',
        data
    })
}


