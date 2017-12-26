import fetch from 'utils/fetch';

export function getSysMessageFiledList(query) {
    return fetch({
        url: '/api/baseSystem/data/messageFiled/list',
        method: 'get',
        params: query
    });
}

export function getAllSysMessageFiled() {
    return fetch({
        url: '/api/baseSystem/data/messageFiled/getAll',
        method: 'get'
    });
}

export function createSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetch({
        url: '/api/baseSystem/data/messageFiled/add',
        method: 'post',
        data
    })
}

export function updateSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetch({
        url: '/api/baseSystem/data/messageFiled/edit',
        method: 'post',
        data
    })
}
export function delSysMessageFileds(ids) {
    const data = {ids};
    return fetch({
        url: '/api/baseSystem/data/messageFiled/dels',
        method: 'post',
        data
    })
}
export function deleteSysMessageFiled(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/data/messageFiled/delete',
        method: 'post',
        data
    })
}


