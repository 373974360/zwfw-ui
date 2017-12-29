import fetch from 'utils/fetch';

export function getAllAddresseesByMemberId(query) {
    return fetch({
        url: '/api/hallSystem/memberAddressee/getAll',
        method: 'get',
        params: query
    });
}