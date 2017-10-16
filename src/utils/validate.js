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
    const reg = /^((13|15|18|14|17)+\d{9})$/;
    return reg.test(str);
}

/* 身份证号码的验证规则*/
export function isIdCardNo(num) {
    let len = num.length, re;
    if (len === 15) {
        re = new RegExp(/^(\d{6})()?(\d{2})(\d{2})(\d{2})(\d{2})(\w)$/);
    } else if (len === 18) {
        re = new RegExp(/^(\d{6})()?(\d{4})(\d{2})(\d{2})(\d{3})(\w)$/);
    } else {
        return false;
    }
    let a = num.match(re);
    if (a != null) {
        let D, B;
        if (len === 15) {
            D = new Date(`19${a[3]}/${a[4]}/${a[5]}`);
            B = D.getYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        } else {
            D = new Date(`${a[3]}/${a[4]}/${a[5]}`);
            B = D.getFullYear() == a[3] && (D.getMonth() + 1) == a[4] && D.getDate() == a[5];
        }
        if (!B) {
            return false;
        }
    }
    if (!re.test(num)) {
        return false;
    }
    return true;
}