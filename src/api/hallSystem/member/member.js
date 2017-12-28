import fetch from 'utils/fetch';

export function getByNameOrLoginName(name) {
    return fetch({
        url: '/api/hallSystem/member/getByNameOrLoginName',
        method: 'get',
        params: {name}
    });
}

export function getMemberById(id) {
    return fetch({
        url: '/api/hallSystem/member/get',
        method: 'get',
        params: {id}
    })
}