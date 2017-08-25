import {fetchSys} from 'utils/fetchSys';

export function getSysMessageFiledList(query) {
    return fetchSys({
        url: '/sysMessageFiled/list',
        method: 'get',
        params: query
    });
}

export function createSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetchSys({
        url: '/sysMessageFiled/add',
        method: 'post',
        data
    })
}

export function updateSysMessageFiled(sysMessageFiledVo){
    const data = sysMessageFiledVo;
    return fetchSys({
        url: '/sysMessageFiled/edit',
        method: 'post',
        data
    })
}
export function delSysMessageFileds(ids) {
    const data = {ids};
    return fetchSys({
        url: '/sysMessageFiled/dels',
        method: 'post',
        data
    })
}
export function deleteSysMessageFiled(id) {
    const data = {id};
    return fetchSys({
        url: '/sysMessageFiled/delete',
        method: 'post',
        data
    })
}


