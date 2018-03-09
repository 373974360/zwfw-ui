import fetch from 'utils/fetch';

export function plotByCategory(query) {
    return fetch({
        url: '/api/hallSystem/count/dataPlot/plotByCategory',
        method: 'get',
        params: query
    });
}

export function plotByWindow(query) {
    return fetch({
        url: '/api/hallSystem/count/dataPlot/plotByWindow',
        method: 'get',
        params: query
    });
}

export function plotByUser(query) {
    return fetch({
        url: '/api/hallSystem/count/dataPlot/plotByUser',
        method: 'get',
        params: query
    });
}

export function plotByFixCategory(query) {
    return fetch({
        url: '/api/hallSystem/count/dataPlot/plotByFixCategory',
        method: 'get',
        params: query
    });
}