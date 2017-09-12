import axios from 'axios';
import {Message} from 'element-ui';
import store from '../store';
import Qs from 'qs'
import router from '../router';

let baseURL = '';

export function fetchSys(object) {
    baseURL = process.env.SYS_API;
    return fetch(object);
}

export function fetchZwfw(object) {
    baseURL = process.env.ZWFW_API;
    return fetch(object);
}

export function fetchTask(object) {
    baseURL = process.env.TASK_API;
    return fetch(object);
}

export function fetchJob(object) {
    baseURL = process.env.JOB_API;
    return fetch(object);
}

export function fetchZwfwActiviti(object) {
    baseURL = process.env.ZWFW_ACTIVITI_API;
    return fetch(object);
}

function fetch(object) {
    // 创建axios实例
    const service = axios.create({
        // headers: {'Content-Type': 'application/x-www-form-urlencoded'},
        baseURL: baseURL, // api的base_url
        timeout: 1000 * 60 * 5,                  // 请求超时时间  1000 * 60 * 5
        withCredentials: true,  // 跨域允许cookie
        // 请求数据转为json格式 springmvc自动填充
        transformRequest: [function (data) {
            if (!data) {
                data = {}
            }
            data = Qs.stringify(data, {arrayFormat: 'brackets'})
            return data
        }]
    });
    // request拦截器
    service.interceptors.request.use(config => {
        if (store.getters.token) {
            config.headers['Base4j-Token'] = store.getters.token; // 让每个请求携带token--['Base4j-Token']为自定义key 请根据实际情况自行修改
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
            let code = response.status;
            /**
             * 下面的注释为通过response自定义code来标示请求状态，当code返回如下情况为权限有问题，登出并返回到登录页
             * 如通过xmlhttprequest 状态码标识 逻辑可写在下面error中
             */
            // // 50014:Token 过期了 50012:其他客户端登录了 50008:非法的token
            if (code !== 200) {
                if (code === 207) {
                    Message({
                        message: "短时间内请求太过频繁，请重新刷新页面",
                        type: 'error',
                        duration: 5 * 1000
                    });
                } else {
                    Message({
                        message: response.data.msg,
                        type: 'error',
                        duration: 5 * 1000
                    });
                }
            } else {
                code = response.data.httpCode;
                if (code === 401) {
                    Message({
                        message: "登录超时，请重新登录",
                        type: 'error',
                        duration: 5 * 1000
                    });
                    // 登出
                    store.dispatch('LogOut').then(() => {
                        router.push({path: '/login'})
                    });
                }
                if (code === 403) {
                    Message({
                        message: "当前登录用户没有此权限",
                        type: 'error',
                        duration: 5 * 1000
                    });
                }
            }
            return response.data;
        },
        error => {
            Message({
                message: error.message,
                type: 'error',
                duration: 5 * 1000
            });
            return Promise.reject(error);
        }
    );
    return service(object);
}
