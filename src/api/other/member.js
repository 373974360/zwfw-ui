import fetch from 'utils/fetch';

export function getZwfwMemberList(query) {
    return fetch({
        url: '/api/zwfw/Member/list',
        method: 'get',
        params: query
    });
}

export function createZwfwMember(zwfwMemberVo){
    const data = zwfwMemberVo;
    return fetch({
        url: '/api/zwfw/Member/add',
        method: 'post',
        data
    })
}

export function updateZwfwMember(zwfwMemberVo){
    const data = zwfwMemberVo;
    return fetch({
        url: '/api/zwfw/Member/edit',
        method: 'post',
        data
    })
}
export function delZwfwMembers(ids) {
    const data = {ids};
    return fetch({
        url: '/api/zwfw/Member/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwMember(id) {
    const data = {id};
    return fetch({
        url: '/api/zwfw/Member/delete',
        method: 'post',
        data
    })
}


