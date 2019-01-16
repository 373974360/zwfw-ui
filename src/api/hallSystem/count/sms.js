/**
 * Created by deya-01 on 2017/11/17.
 */
import fetch from 'utils/fetch';


/**
 * 获取设置
 * @param query
 */
export function getHallCountMsg() {
    return fetch({
        url: '/api/hallSystem/sms/setting/get',
        method: 'get'
    });
}

/**
 * 保存设置
 * @param query
 */
export function updateHallCountMsg(text) {
    return fetch({
        url: '/api/hallSystem/sms/setting/update',
        method: 'post',
        params: {text}
    });
}