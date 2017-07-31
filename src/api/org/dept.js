import fetch from 'utils/fetch';

export function getDeptList(query) {
    return fetch({
        url: '/sysDept/list',
        method: 'get',
        params: query
    });
}

export function getDeptTree() {
    return fetch({
        url: '/sysDept/getTree',
        method: 'get'
    });
}

export function getDeptCascader(id) {
    return fetch({
        url: '/sysDept/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/sysDept/add',
        method: 'post',
        data
    })
}

export function updateDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/sysDept/edit',
        method: 'post',
        data
    })
}
export function delDept(id) {
    const data = {id};
    return fetch({
        url: '/sysDept/del',
        method: 'post',
        data
    })
}

export function deleteDept(id) {
    const data = {id};
    return fetch({
        url: '/sysDept/delete',
        method: 'post',
        data
    })
}




