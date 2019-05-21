import fetch from 'utils/fetch';

export function queryLogistics(company, number) {
    const data = {company, number};
    return fetch({
        url: '/api/workSystem/itemHandType/queryLogistics',
        method: 'get',
        params: data
    });
}

export function queryRealLogistics(company, number) {
    return fetch({
        url: '/api/express/logistics/queryLogistics',
        method: 'get',
        params: {company, number, remote: true}
    })
}
