import Cookies from 'js-cookie';
import {getEnums} from 'api/common';

const app = {
    state: {
        page: 1,
        rows: 15,
        pageSize: [10, 15, 20, 30, 40, 50, 100],
        textMap: {
            create: '创建',
            update: '编辑',
            view: '查看',
            roleMenu: '关联权限',
            roleUser: '关联用户'
        },
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
        enums: [],
        theme: 'default',
        livenewsChannels: Cookies.get('livenewsChannels') || '[]'
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
                        const enums = response.data;
                        commit('SET_ENUMS', enums);
                    }
                }).catch(error => {
                    reject(error);
                });
            });
        },
    }
};

export default app;
