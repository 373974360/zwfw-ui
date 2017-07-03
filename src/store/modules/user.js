import {loginByEmail, logout, getInfo} from 'api/login';
import Cookies from 'js-cookie';

const user = {
    state: {
        user: '',
        status: '',
        account: '',
        code: '',
        uid: undefined,
        auth_type: '',
        token: Cookies.get('Base4j-Token'),
        name: '',
        avatar: '',
        introduction: '',
        permissions: [],
        setting: {
            articlePlatform: []
        }
    },

    mutations: {
        SET_AUTH_TYPE: (state, type) => {
            state.auth_type = type;
        },
        SET_CODE: (state, code) => {
            state.code = code;
        },
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_UID: (state, uid) => {
            state.uid = uid;
        },
        SET_EMAIL: (state, account) => {
            state.account = account;
        },
        SET_INTRODUCTION: (state, introduction) => {
            state.introduction = introduction;
        },
        SET_SETTING: (state, setting) => {
            state.setting = setting;
        },
        SET_STATUS: (state, status) => {
            state.status = status;
        },
        SET_NAME: (state, name) => {
            state.name = name;
        },
        SET_AVATAR: (state, avatar) => {
            state.avatar = avatar;
        },
        SET_PERMISSINSS: (state, permissions) => {
            state.permissions = permissions;
        },
        LOGIN_SUCCESS: () => {
            console.log('login success')
        },
        LOGOUT_USER: state => {
            state.user = '';
        }
    },

    actions: {
        // 邮箱登录
        LoginByEmail({commit}, userInfo) {
            return new Promise((resolve, reject) => {
                loginByEmail(userInfo).then(response => {
                    if (response.httpCode !== 200) {
                        reject(response.msg);
                    } else {
                        const data = response.data;
                        Cookies.set('Base4j-Token', data.id);
                        commit('SET_TOKEN', data.id);
                        commit('SET_EMAIL', data.account);
                        resolve();
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 获取用户信息
        GetInfo({commit, state}) {
            return new Promise((resolve, reject) => {
                getInfo(state.token).then(response => {
                    const data = response.data;
                    commit('SET_PERMISSINSS', data.permissions);
                    commit('SET_NAME', data.userName);
                    commit('SET_AVATAR', data.avatar);
                    commit('SET_UID', data.id);
                    commit('SET_INTRODUCTION', data.remark);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout(state.token).then(() => {
                    commit('SET_TOKEN', '');
                    Cookies.remove('Base4j-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default user;
