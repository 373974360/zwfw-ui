/**
 * Created by deya-01 on 2017/9/15.
 */
import fetch from 'utils/fetch';

export function getZwfwItemNumberList(query) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindowHistory/list',
        method: 'get',
        params: query
    });
}

export function getDatilByItemNumberId(id) {
    return fetch({
        url: '/api/hallSystem/hallCompositeWindow/query',
        method: 'get',
        params: {id}
    });
}
