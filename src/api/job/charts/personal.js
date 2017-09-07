import {fetchJob} from 'utils/fetch';

export function getCharts(query) {
    return fetchJob({
        url: '/jobPersonal/getCharts',
        method: 'get',
        params: query
    });
}