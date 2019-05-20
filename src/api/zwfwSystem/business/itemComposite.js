import fetch from 'utils/fetch';

export function listBasicByCompositeId(compositeId) {
    return fetch({
        url: '/api/zwfwSystem/business/itemComposite/listBasicByCompositeId',
        method: 'get',
        params: {compositeId}
    });
}

export function saveItemComposite(compositeId, itemIds) {
    const data = {compositeId, itemIds};
    return fetch({
        url: '/api/zwfwSystem/business/itemComposite/save',
        method: 'post',
        data
    });
}
