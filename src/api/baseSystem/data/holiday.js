import fetch from 'utils/fetch';



export function createOrUpdateDate(sysHolidayVo) {
    const data = sysHolidayVo;
    return fetch({
        url: '/api/baseSystem/data/holiday/addHoliday',
        method: 'post',
        data
    })
}
export function getHoliday(query) {
    return fetch({
        url: '/api/baseSystem/data/holiday/getAll',
        method: 'get',
        params: query
    });
}







