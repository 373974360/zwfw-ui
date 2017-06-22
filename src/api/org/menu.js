import fetch from 'utils/fetch';

export function getMenuList(query) {
    return fetch({
        url: '/sysMenu/selectSysMenuTree',
        method: 'get',
        params: query
    });
}


export function getMenuInfo(id) {
    const data = {id: id};
    return fetch({
        url: '/sysMenu/select',
        method: 'get',
        params: data
    });
}




