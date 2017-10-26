import {fetchSys} from 'utils/fetch';

export function getMenuTree() {
    return fetchSys({
        url: '/api/admin/sysMenu/getTree',
        method: 'get'
    });
}

export function getMenuCascader(id) {
    return fetchSys({
        url: '/api/admin/sysMenu/getCascader',
        method: 'get',
        params:{id}
    });
}

export function createMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetchSys({
        url: '/api/admin/sysMenu/add',
        method: 'post',
        data
    })
}

export function updateMenu(sysMenuVo) {
    const data = sysMenuVo;
    return fetchSys({
        url: '/api/admin/sysMenu/edit',
        method: 'post',
        data
    })
}

export function delMenu(id) {
    const data = {id};
    return fetchSys({
        url: '/api/admin/sysMenu/del',
        method: 'post',
        data
    })
}

export function deleteMenu(id) {
    const data = {id};
    return fetchSys({
        url: '/api/admin/sysMenu/delete',
        method: 'post',
        data
    })
}
