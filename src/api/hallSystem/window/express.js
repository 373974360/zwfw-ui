import fetch from 'utils/fetch';

export function queryLogistics(company, number) {
    const data = {company, number};
    return fetch({
        url: '/api/hallSystem/express/queryLogistics',
        method: 'get',
        params: data
    });
}