import fetch from 'utils/fetch';

export function getDeptList(query) {
    return fetch({
        url: '/api/admin/sysDept/list',
        method: 'get',
        params: query
    });
}

export function getDeptTree() {
    return fetch({
        url: '/api/admin/sysDept/getTree',
        method: 'get'
    });
}

export function getDeptCascader(id) {
    return fetch({
        url: '/api/admin/sysDept/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/api/admin/sysDept/add',
        method: 'post',
        data
    })
}

export function updateDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/api/admin/sysDept/edit',
        method: 'post',
        data
    })
}
export function delDept(id) {
    const data = {id};
    return fetch({
        url: '/api/admin/sysDept/del',
        method: 'post',
        data
    })
}

export function deleteDept(id) {
    const data = {id};
    return fetch({
        url: '/api/admin/sysDept/delete',
        method: 'post',
        data
    })
}




