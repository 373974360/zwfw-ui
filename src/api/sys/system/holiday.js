import fetchSys from 'utils/fetchSys';



export function createOrUpdateDate(sysHolidayVo) {
    const data = sysHolidayVo;
    return fetchSys({
        url: '/sysHoliday/addHoliday',
        method: 'post',
        data
    })
}
export function getHoliday(query) {
    return fetchSys({
        url: '/sysHoliday/getAll',
        method: 'get',
        params: query
    });
}







