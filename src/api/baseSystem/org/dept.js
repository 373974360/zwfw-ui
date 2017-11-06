import fetch from 'utils/fetch';

export function getDeptList(query) {
    return fetch({
        url: '/api/baseSystem/org/dept/list',
        method: 'get',
        params: query
    });
}

export function getDeptTree() {
    return fetch({
        url: '/api/baseSystem/org/dept/getTree',
        method: 'get'
    });
}

export function getDeptCascader(id) {
    return fetch({
        url: '/api/baseSystem/org/dept/getCascader',
        method: 'get',
        params: {id}
    });
}

export function createDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/api/baseSystem/org/dept/add',
        method: 'post',
        data
    })
}

export function updateDept(sysDeptVo){
    const data = sysDeptVo;
    return fetch({
        url: '/api/baseSystem/org/dept/edit',
        method: 'post',
        data
    })
}
export function delDept(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/org/dept/del',
        method: 'post',
        data
    })
}

export function deleteDept(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/org/dept/delete',
        method: 'post',
        data
    })
}




