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

/**
 *手动触发短信通知
 * @param text
 */
export function sendMessage(message) {
    return fetch({
        url: '/api/hallSystem/sms/setting/sendMessage',
        method: 'post',
        params: {message}
    });
}