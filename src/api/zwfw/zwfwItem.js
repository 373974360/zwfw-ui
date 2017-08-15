import fetchZwfw from 'utils/fetchZwfw';

export function getZwfwItemList(query) {
    return fetchZwfw({
        url: '/zwfwItem/list',
        method: 'get',
        params: query
    });
}

export function createZwfwItem(zwfwItemVo){
    const data = zwfwItemVo;
    return fetchZwfw({
        url: '/zwfwItem/add',
        method: 'post',
        data
    })
}

export function updateZwfwItem(zwfwItemVo){
    const data = zwfwItemVo;
    return fetchZwfw({
        url: '/zwfwItem/edit',
        method: 'post',
        data
    })
}
export function delZwfwItems(ids) {
    const data = {ids};
    return fetchZwfw({
        url: '/zwfwItem/dels',
        method: 'post',
        data
    })
}
export function deleteZwfwItem(id) {
    const data = {id};
    return fetchZwfw({
        url: '/zwfwItem/delete',
        method: 'post',
        data
    })
}


