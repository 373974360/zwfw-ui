import Cookies from 'js-cookie';
import {getDicts, getEnums, getZwfwEnums} from 'api/common/common';

const app = {
    state: {
        page: 1,
        rows: 15,
        pageSize: [10, 15, 20, 30, 40, 50, 100],
        textMap: {
            create: '创建',
            update: '编辑',
            view: '查看',
            associateMenu: '关联权限',
            associateUser: '关联用户',
            associateMaterial: '关联材料',
            associateItem: '关联事项'
        },
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
        enums: [],
        dics: [],
        theme: 'default',
        livenewsChannels: Cookies.get('livenewsChannels') || '[]',
        closeOnClickModal: false,
        loadedEnums: [],
        currentSystem: Cookies.get('CurrentSystem'),
        routeComplete: false
    },
    mutations: {
        TOGGLE_SIDEBAR: state => {
            if (state.sidebar.opened) {
                Cookies.set('sidebarStatus', 1);
            } else {
                Cookies.set('sidebarStatus', 0);
            }
            state.sidebar.opened = !state.sidebar.opened;
        },
        SET_ENUMS: (state, enums) => {
            state.enums = enums;
        },
        SET_ZWFWEDATADATA: (state, enums) => {
            state.enums = enums;
        },
        SET_DICTS: (state, dics) => {
            state.dics = dics;
        },
        SET_SYSTEM:(state, currentSystem) =>{
            state.currentSystem = currentSystem;
        }
    },
    actions: {
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        },
        // 获取后台的所有枚举json数据
        SetEnums({commit}) {
            return new Promise((resolve, reject) => {
                getEnums().then(response => {
                    if (response.httpCode !== 200) {
                        reject(response.msg);
                    } else {
                        const enums = {};
                        const result = response.data;
                        for (const obj of result) {
                            enums[obj.name] = obj.value;
                        }
                        commit('SET_ENUMS', enums);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },
        // 获取后台字典项目json数据
        SetDicts({commit}) {
            return new Promise((resolve, reject) => {
                getDicts().then(response => {
                    if (response.httpCode !== 200) {
                        reject(response.msg);
                    } else {
                        let dics = {};
                        let result = response.data;
                        for (let obj of result) {
                            dics[obj.name] = obj.value;
                        }
                        commit('SET_DICTS', dics);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },
        SetSystem({commit}, data) {
            return new Promise(resolve => {
                commit('SET_SYSTEM', data);
                resolve();
            })
        }
    }
};

export default app;
