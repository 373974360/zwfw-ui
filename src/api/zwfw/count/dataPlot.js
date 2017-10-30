import fetch from 'utils/fetch';

export function plotByCategory(query) {
    return fetch({
        url: '/api/zwfw/dataPlot/plotByCategory',
        method: 'get',
        params: query
    });
}

export function plotByWindow(query) {
    return fetch({
        url: '/api/zwfw/dataPlot/plotByWindow',
        method: 'get',
        params: query
    });
}

export function plotByUser(query) {
    return fetch({
        url: '/api/zwfw/dataPlot/plotByUser',
        method: 'get',
        params: query
    });
}

