import {fetchSys} from 'utils/fetch';

export function getDeptList(query) {
    return fetchSys({
        url: '/sysDept/list',
        method: 'get',
        params: query
    });
}

export function getDeptTree() {
    return fetchSys({
        url: '/sysDept/getTree',
        method: 'get'
    });
}

export function getDeptCascader(id) {
    return fetchSys({
        url: '/sysDept/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createDept(sysDeptVo){
    const data = sysDeptVo;
    return fetchSys({
        url: '/sysDept/add',
        method: 'post',
        data
    })
}

export function updateDept(sysDeptVo){
    const data = sysDeptVo;
    return fetchSys({
        url: '/sysDept/edit',
        method: 'post',
        data
    })
}
export function delDept(id) {
    const data = {id};
    return fetchSys({
        url: '/sysDept/del',
        method: 'post',
        data
    })
}

export function deleteDept(id) {
    const data = {id};
    return fetchSys({
        url: '/sysDept/delete',
        method: 'post',
        data
    })
}




