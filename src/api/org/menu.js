import fetch from 'utils/fetch';

export function getMenuTree() {
    return fetch({
        url: '/sysMenu/selectTree',
        method: 'get'
    });
}

export function getMenuCascader(id) {
    return fetch({
        url: '/sysMenu/selectCascader',
        method: 'get',
        params:{id}
    });
}

export function createMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetch({
        url: '/sysMenu/add',
        method: 'post',
        data
    })
}

export function updateMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetch({
        url: '/sysMenu/edit',
        method: 'post',
        data
    })
}

export function delMenu(id) {
    const data = {id};
    return fetch({
        url: '/sysMenu/del',
        method: 'post',
        data
    })
}

export function deleteMenu(id) {
    const data = {id};
    return fetch({
        url: '/sysMenu/delete',
        method: 'post',
        data
    })
}
