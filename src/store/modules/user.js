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
        token: Cookies.get('Admin-Token'),
        name: '',
        avatar: '',
        introduction: '',
        roles: [],
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
        SET_ROLES: (state, roles) => {
            state.roles = roles;
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
                    const data = response.data;
                    Cookies.set('Admin-Token', data.id);
                    commit('SET_TOKEN', data.id);
                    commit('SET_EMAIL', data.account);
                    resolve();
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
                    commit('SET_ROLES', data.role);
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
                    commit('SET_ROLES', []);
                    Cookies.remove('Admin-Token');
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 前端 登出
        FedLogOut({commit}) {
            return new Promise(resolve => {
                commit('SET_TOKEN', '');
                Cookies.remove('Admin-Token');
                resolve();
            });
        },

        // 动态修改权限
        ChangeRole({commit}, role) {
            return new Promise(resolve => {
                commit('SET_ROLES', [role]);
                commit('SET_TOKEN', role);
                Cookies.set('Admin-Token', role);
                resolve();
            })
        }
    }
};

export default user;
