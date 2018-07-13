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
        '启用': 'success',
        '停用': 'gray',
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

export function deliveryStatusFilter(status) {
    const deliveryStatusMap = {
        1: '在途中',
        2: '派件中',
        3: '已签收',
        4: '派送失败（拒签等）'
    };
    return deliveryStatusMap[status];
}

export function expressTypeFilter(type) {
    const expressTypeMap = {
        'EMS': '邮政EMS',
        'HTKY': '百世快递',
        'DEPPON': '德邦物流',
        'GTO': '国通快递',
        'KYEXPRESS': '跨越速运',
        'STO': '申通快递',
        'SFEXPRESS': '顺丰速运',
        'TTKDEX': '天天快递',
        'YTO': '圆通速递',
        'YUNDA': '韵达快递',
        'ZJS': '宅急送',
        'ZTO': '中通快递'
    };
    return expressTypeMap[type];
}

export function enums(value, type) {

    if(type == 'Enable' && value==-1) {
        return '已删除';
    }
    var array = app.state.enums[type];
    if(!array) {
        console.warn('没有枚举类型' + type);
        return value;
    }
    var result = array.filter(function (item) {
        return item.code === value;
    });
    if (result[0]) {
        return result[0].value || value;
    } else {
        return value;
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
            return value;
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

export function parseToInt(value) {
    if (!value && value !== 0 && value !== '0') {
        return '';
    }
    return parseInt(value);
}

export function removeNote(value, str) {
    if (!str) {
        str = '';
    }
    return value.replace(/\(.*?\)/g, str);
}