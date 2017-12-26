import {loginByEmail,refreshToken, logout, getInfo} from 'api/common/login/login';
import {
    getToken,
    setToken,
    removeToken
} from 'utils/auth';
const user = {
    state: {
        user: '',
        account: '',
        uid: undefined,
        token: getToken(),
        name: '',
        deptName: '',
        empNo: '',
        avatar: '',
        introduction: '',
        permissions: []
    },

    mutations: {
        SET_TOKEN: (state, token) => {
            state.token = token;
        },
        SET_INFO: (state, info) => {
            state.uid = info.id;
            state.introduction = info.remark;
            state.name = info.name;
            state.empNo = info.empNo;
            state.avatar = info.avatar;
            state.permissions = info.permissions;
            state.deptName = info.deptVo.name;
        }
    },

    actions: {
        // 邮箱登录
        LoginByEmail({commit}, userInfo) {
            commit('SET_TOKEN', '');
            removeToken();
            return new Promise((resolve, reject) => {
                loginByEmail(userInfo).then(response => {
                    if (response.httpCode !== 200) {
                        reject(response.msg);
                    } else {
                        const data = response.data;
                        setToken(data);
                        commit('SET_TOKEN', data);
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
                getInfo().then(response => {
                    const data = response.data;
                    commit('SET_INFO', data);
                    resolve(response);
                }).catch(error => {
                    reject(error);
                });
            });
        },

        //刷新token
        RefreshToken({commit, state}){
            return new Promise((resolve, reject) => {
                refreshToken().then(response => {
                    const data = response.data;
                    setToken(data);
                    commit('SET_TOKEN', data);
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        },

        // 登出
        LogOut({commit, state}) {
            return new Promise((resolve, reject) => {
                logout().then(() => {
                    commit('SET_TOKEN', '');
                    removeToken();
                    resolve();
                }).catch(error => {
                    reject(error);
                });
            });
        }
    }
};

export default user;
