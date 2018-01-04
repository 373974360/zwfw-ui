import fetch from 'utils/fetch';

export function getMemberList(query) {
    return fetch({
        url: '/api/jobSystem/jobMember/list',
        method: 'get',
        params: query
    });
}

export function createJobMember(jobMemberVo) {
    const data = jobMemberVo;
    return fetch({
        url: '/api/jobSystem/jobMember/add',
        method: 'post',
        data
    })
}

export function updateJobMember(jobMemberVo) {
    const data = jobMemberVo;
    return fetch({
        url: '/api/jobSystem/jobMember/edit',
        method: 'post',
        data
    })
}
export function delJobMember(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobMember/dels',
        method: 'post',
        data
    })
}
export function resetPassJobMember(ids) {
    const data = {ids};
    return fetch({
        url: '/api/jobSystem/jobMember/resetpass',
        method: 'post',
        data
    })
}
export function resetJobMember(data) {
    return fetch({
        url: '/api/jobSystem/jobMember/reset',
        method: 'post',
        data
    })
}


