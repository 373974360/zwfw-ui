import Cookies from 'js-cookie';

const app = {
    state: {
        page: 1,
        rows: 20,
        pageSize: [10,20,30,40,50],
        sidebar: {
            opened: !+Cookies.get('sidebarStatus')
        },
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
        }
    },
    actions: {
        ToggleSideBar: ({commit}) => {
            commit('TOGGLE_SIDEBAR')
        }
    }
};

export default app;
