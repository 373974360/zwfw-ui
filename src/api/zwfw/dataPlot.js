import {fetchZwfw} from 'utils/fetch';

export function plotByCategory(query) {
    return fetchZwfw({
        url: '/dataPlot/plotByCategory',
        method: 'get',
        params: query
    });
}

export function plotByWindow(query) {
    return fetchZwfw({
        url: '/dataPlot/plotByWindow',
        method: 'get',
        params: query
    });
}

export function plotByUser(query) {
    return fetchZwfw({
        url: '/dataPlot/plotByUser',
        method: 'get',
        params: query
    });
}

