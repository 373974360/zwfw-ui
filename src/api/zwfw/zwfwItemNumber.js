/**
 * Created by deya-01 on 2017/9/15.
 */
import {fetchZwfw} from 'utils/fetch';

export function getZwfwItemNumberList(query) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindowHistory/list',
        method: 'get',
        params: query
    });
}

export function getDatilByItemNumberId(id) {
    return fetchZwfw({
        url: '/zwfwHallCompositeWindow/query',
        method: 'get',
        params: {id}
    });
}
