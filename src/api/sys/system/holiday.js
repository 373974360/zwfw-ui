import {fetchSys} from 'utils/fetch';



export function createOrUpdateDate(sysHolidayVo) {
    const data = sysHolidayVo;
    return fetchSys({
        url: '/api/admin/sysHoliday/addHoliday',
        method: 'post',
        data
    })
}
export function getHoliday(query) {
    return fetchSys({
        url: '/api/admin/sysHoliday/getAll',
        method: 'get',
        params: query
    });
}







