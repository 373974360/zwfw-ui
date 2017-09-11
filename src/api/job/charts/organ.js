import {fetchJob} from 'utils/fetch';

export function getCharts(query) {
    return fetchJob({
        url: '/jobOrgan/getCharts',
        method: 'get',
        params: query
    });
}