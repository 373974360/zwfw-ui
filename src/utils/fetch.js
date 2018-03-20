import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
import {getToken} from 'utils/auth';
import Qs from 'qs'
import router from '../router';

export function getZwfwApiHost() {
    return process.env.ZWFW_API;
}

// 创建axios实例
const service = axios.create({
    // headers: {'Content-Type': 'application/json;charset=UTF-8'},
    // baseURL: baseURL, // api的base_url
    timeout: 1000 * 60 * 5,                  // 请求超时时间  1000 * 60 * 5
    // withCredentials: true,  // 跨域允许cookie
    // 请求数据转为json格式 springmvc自动填充
    transformRequest: [function (data) {
        if (!data) {
            data = {}
        }
        data = Qs.stringify(data, {arrayFormat: 'brackets', allowDots: true})
        return data
    }]
});
// request拦截器
service.interceptors.request.use(config => {
    if (store.getters.token) {
        config.headers['User-Authorization'] = getToken(); // 让每个请求携带token--['X-Token']为自定义key 请根据实际情况自行修改
    }
    return config;
}, error => {
    // Do something with request error
    console.log(error); // for debug
    Promise.reject(error);
});

// respone拦截器
service.interceptors.response.use(
    response => {
        let code = response.data.httpCode;
        /**
         * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
         * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
         */
        // // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
        if (code === 207) {
            Message({
                message: "短时间内请求太过频繁，请重新刷新页面",
                type: 'error',
                duration: 5 * 1000
            });
        }
        if (code === 400) {
            Message({
                message: "请求参数出错，请重新填写",
                type: 'error',
                duration: 5 * 1000
            });
        }
        if (code === 455) {
            Message({
                message: "非法参数，请重试",
                type: 'error',
                duration: 5 * 1000
            });
        }
        if (code === 500) {
            Message({
                message: response.data.msg,
                type: 'error',
                duration: 5 * 1000
            });
        }
        if (code === 40101) {
            Message({
                message: "登录超时，请重新登录",
                type: 'error',
                duration: 5 * 1000
            });
            // 登出
            store.dispatch('LogOut').then(() => {
                router.push({path: '/login'});
            });
        }
        if (code === 40102) {
            Message({
                message: "当前登录用户没有此权限",
                type: 'error',
                duration: 5 * 1000
            });
        }
        const refreshtoken = response.headers.refresh_token;
        if (refreshtoken) {
            // 刷新token
            store.dispatch('RefreshToken').then(() => {
                console.dir("刷新token成功");
            });
        }
        return response.data;
    },
    error => {
        Message({
            message: "系统错误，请联系管理员",
            type: 'error',
            duration: 5 * 1000
        });
        return Promise.reject(error);
    }
);
export default service;

