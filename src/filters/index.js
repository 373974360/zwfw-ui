import app from 'store/modules/app';
import moment from 'moment';

export function date(value, format) {
    if (value) {
        return moment(value).format(format);
    } else {
        return '';
    }
}

export function statusFilter(status) {
    const statusMap = {
        '正常': 'success',
        '禁用': 'gray',
        '已删除': 'danger',
        '菜单': 'success',
        '按钮': 'primary'
    };
    return statusMap[status]
}

export function taskStatusFilter(status) {
    const taskStatusMap = {
        'OK': 'success',
        'CRASHED': 'danger',
        'DISABLED': 'gray',
        'SHARDING_FLAG': 'primary',
    };
    return taskStatusMap[status]
}

export function smsStatusFilter(status) {
    const smsStatusMap = {
        '2': 'success',
        '3': 'danger',
        '0': 'gray',
        '1': 'primary',
    };
    return smsStatusMap[status]
}

export function enums(value, type) {
    var array = app.state.enums[type];
    if(!array) {
        console.warn('没有枚举类型' + type);
        return '';
    }
    var result = array.filter(function (item) {
        return item.code === value;
    });
    if (result[0]) {
        return result[0].value || value;
    } else {
        return '';
    }
}
export function dics(value, type) {
    var array = app.state.dics[type];
    var result = array.filter(function (item) {
        return item.code === value;
    });
    if (result[0]) {
        return result[0].value || value;
    } else {
        result = array.filter(function (item) {
            return item.code === type + '_' + value;
        });
        if (result[0]) {
            return result[0].value || value;
        } else {
            return '';
        }
    }
}

export function stringToJson(value){
    if(value){
        return JSON.parse(value);
    }
}

/**
 * 把度过的毫秒数转换为人类的语言
 * @param value
 * @returns {*}
 */
export function duration(value) {
    return moment.duration(value).humanize();
}
