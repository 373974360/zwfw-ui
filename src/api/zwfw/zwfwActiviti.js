import fetchZwfwActiviti from 'utils/fetchZwfwActiviti';

/**
 * 流程模型列表接口
 * @param query
 */
export function getZwfwActivitiModelList(query) {
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/list',
        method: 'get',
        params: query
    });
}

/**
 * 流程模型编辑URL获取
 * @param id
 */
export function getZwfwActivitiModelEditUrl(id) {
    const data = {id};
    return fetchZwfwActiviti({
        url: '/zwfw/activiti/model/getEditUrl',
        method: 'get',
        params: data
    });
}
//
// export function createZwfwItem(zwfwItemVo){
//     const data = zwfwItemVo;
//     return fetchZwfwActiviti({
//         url: '/zwfwItem/add',
//         method: 'post',
//         data
//     })
// }
//
// export function updateZwfwItem(zwfwItemVo){
//     const data = zwfwItemVo;
//     return fetchZwfwActiviti({
//         url: '/zwfwItem/edit',
//         method: 'post',
//         data
//     })
// }
// export function delZwfwItems(ids) {
//     const data = {ids};
//     return fetchZwfwActiviti({
//         url: '/zwfwItem/dels',
//         method: 'post',
//         data
//     })
// }
// export function deleteZwfwItem(id) {
//     const data = {id};
//     return fetchZwfwActiviti({
//         url: '/zwfwItem/delete',
//         method: 'post',
//         data
//     })
// }


