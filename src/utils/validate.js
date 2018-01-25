/**
 * Created by jiachenpan on 16/11/18.
 */

/* 是否是邮箱*/
export function isWscnEmail(str) {
    const reg = /^([a-zA-Z0-9_-])+@([a-zA-Z0-9_-])+(.[a-zA-Z0-9_-])+/i;
    return reg.test(str.trim());
}

/* 合法uri*/
export function validateURL(textval) {
    const urlregex = /^(https?|ftp):\/\/([a-zA-Z0-9.-]+(:[a-zA-Z0-9.&%$-]+)*@)*((25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9][0-9]?)(\.(25[0-5]|2[0-4][0-9]|1[0-9]{2}|[1-9]?[0-9])){3}|([a-zA-Z0-9-]+\.)*[a-zA-Z0-9-]+\.(com|edu|gov|int|mil|net|org|biz|arpa|info|name|pro|aero|coop|museum|[a-zA-Z]{2}))(:[0-9]+)*(\/($|[a-zA-Z0-9.,?'\\+&%$#=~_-]+))*$/;
    return urlregex.test(textval);
}

/* 小写字母*/
export function validateLowerCase(str) {
    const reg = /^[a-z]+$/;
    return reg.test(str);
}

/* 大写字母*/
export function validateUpperCase(str) {
    const reg = /^[A-Z]+$/;
    return reg.test(str);
}

/* 大小写字母*/
export function validatAlphabets(str) {
    const reg = /^[A-Za-z]+$/;
    return reg.test(str);
}

export function validatMobiles(str) {
    const reg = /^((13|15|18|14|17|19|16)+\d{9})$/;
    return reg.test(str);
}

//身份证号合法性验证
//支持15位和18位身份证号
//支持地址编码、出生日期、校验位验证
export function isIdCardNo(code) {
    var city = {
        11: "北京",
        12: "天津",
        13: "河北",
        14: "山西",
        15: "内蒙古",
        21: "辽宁",
        22: "吉林",
        23: "黑龙江 ",
        31: "上海",
        32: "江苏",
        33: "浙江",
        34: "安徽",
        35: "福建",
        36: "江西",
        37: "山东",
        41: "河南",
        42: "湖北 ",
        43: "湖南",
        44: "广东",
        45: "广西",
        46: "海南",
        50: "重庆",
        51: "四川",
        52: "贵州",
        53: "云南",
        54: "西藏 ",
        61: "陕西",
        62: "甘肃",
        63: "青海",
        64: "宁夏",
        65: "新疆",
        71: "台湾",
        81: "香港",
        82: "澳门",
        91: "国外 "
    };
    var tip = "";
    var pass = true;
    if (!code || !/^\d{6}(18|19|20)?\d{2}(0[1-9]|1[12])(0[1-9]|[12]\d|3[01])\d{3}(\d|X)$/i.test(code)) {
        //"身份证号格式错误";
        pass = false;
    }

    else if (!city[code.substr(0, 2)]) {
        //"地址编码错误";
        pass = false;
    }
    else {
        //18位身份证需要验证最后一位校验位
        if (code.length == 18) {
            code = code.split('');
            //∑(ai×Wi)(mod 11)
            //加权因子
            var factor = [7, 9, 10, 5, 8, 4, 2, 1, 6, 3, 7, 9, 10, 5, 8, 4, 2];
            //校验位
            var parity = [1, 0, 'X', 9, 8, 7, 6, 5, 4, 3, 2];
            var sum = 0;
            var ai = 0;
            var wi = 0;
            for (var i = 0; i < 17; i++) {
                ai = code[i];
                wi = factor[i];
                sum += ai * wi;
            }
            var last = parity[sum % 11];
            if (parity[sum % 11] != code[17]) {
                //"校验位错误";
                pass = false;
            }
        }
    }
    return pass;
}


/* 统一社会信用代码校验*/
export function checkSocialCreditCode(code) {
    let reg = /^[0-9A-Z]+$/;
    if ((code.length != 18) || !reg.test(code)) {
        return false;
    }
    //如果15位前面补三个0就让过，兼容旧注册号
    if (/^000[0-9A-Z]{15}$/.test(code)) {
        return true;
    }

    let codeChar, codeCharValue;
    let total = 0;
    let weightedFactors = [1, 3, 9, 27, 19, 26, 16, 17, 20, 29, 25, 13, 8, 24, 10, 30, 28];
    let chars = '0,1,2,3,4,5,6,7,8,9,A,B,C,D,E,F,G,H,J,K,L,M,N,P,Q,R,T,U,W,X,Y';
    let charsArr = chars.split(',');
    let charsStr = charsArr.join('');
    for (let i = 0; i < code.length - 1; i++) {
        codeChar = code.substring(i, i + 1);
        codeCharValue = charsStr.indexOf(codeChar);
        total = total + codeCharValue * weightedFactors[i];
    }
    let logicCheckCode = 31 - total % 31;
    if (logicCheckCode == 31) {
        logicCheckCode = 0;
    }
    logicCheckCode = charsArr[logicCheckCode];
    let checkCode = code.substring(17, 18);
    if (logicCheckCode != checkCode) {
        return false;
    }
    return true;
}