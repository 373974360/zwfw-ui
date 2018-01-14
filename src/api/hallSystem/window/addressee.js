import fetch from 'utils/fetch';

export function getAddresseeList(query) {
    return fetch({
        url: '/api/hallSystem/addressee/list',
        method: 'get',
        params: query
    });
}

export function getAllAddressees(query) {
    return fetch({
        url: '/api/hallSystem/addressee/getAll',
        method: 'get',
        params: query
    });
}

export function getAddresseeById(id) {
    return fetch({
        url: '/api/hallSystem/addressee/get',
        method: 'get',
        params: {id}
    })
}

export function addAddressee(addresseeVo) {
    const data = addresseeVo;
    return fetch({
        url: '/api/hallSystem/addressee/add',
        method: 'post',
        data
    });
}

export function updateAddressee(addresseeVo) {
    const data = addresseeVo;
    return fetch({
        url: '/api/hallSystem/addressee/edit',
        method: 'post',
        data
    });
}

export function delAddressees(ids) {
    const data = {ids};
    return fetch({
        url: '/api/hallSystem/addressee/dels',
        method: 'post',
        data
    });
}

export function setDefaultAddressee(id) {
    const data = {id};
    return fetch({
        url: '/api/hallSystem/addressee/setDefaultAddressee',
        method: 'post',
        data
    })
}