import fetch from 'utils/fetch';

export function getMenuTree() {
    return fetch({
        url: '/api/baseSystem/org/menu/getTree',
        method: 'get'
    });
}

export function getMenuCascader(id) {
    return fetch({
        url: '/api/baseSystem/org/menu/getCascader',
        method: 'get',
        params:{id}
    });
}

export function createMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetch({
        url: '/api/baseSystem/org/menu/add',
        method: 'post',
        data
    })
}

export function updateMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetch({
        url: '/api/baseSystem/org/menu/edit',
        method: 'post',
        data
    })
}

export function delMenu(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/org/menu/del',
        method: 'post',
        data
    })
}

export function deleteMenu(id) {
    const data = {id};
    return fetch({
        url: '/api/baseSystem/org/menu/delete',
        method: 'post',
        data
    })
}
