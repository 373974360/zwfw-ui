import {fetchZwfw} from 'utils/fetch';

export function getZwfwMemberList(query) {
    return fetchZwfw({
        url: '/zwfwMember/list',
        method: 'get',
        params: query
    });
}

export function createZwfwMember(zwfwMemberVo){
    const data = zwfwMemberVo;
    return fetchZwfw({
        url: '/zwfwMember/add',
        method: 'post',
        data
    })
}

export function updateZwfwMember(zwfwMemberVo){
    const data = zwfwMemberVo;
    return fetchZwfw({
        url: '/zwfwMember/edit',
        method: 'post',
        data
    })
}
export function delZwfwMembers(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwMember/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwMember(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwMember/delete',
        method: 'post',
        data
    })
}


