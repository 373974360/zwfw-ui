import {asyncRouterMap, constantRouterMap} from 'src/router';
import Cookies from 'js-cookie';

function hasPermission(permissions, route) {
    const currentSystem = Cookies.get('CurrentSystem');
    if (currentSystem) {
        if (route.meta && route.meta.permission) {
            return permissions.some(permission => route.meta.permission.indexOf(permission) >= 0 && route.meta.permission.indexOf(currentSystem) >= 0)
        } else {
            return true
        }
    } else {
        return false;
    }

}

const permission = {
    state: {
        routers: constantRouterMap,
        addRouters: []
    },

    mutations: {
        SET_ROUTERS: (state, routers) => {
            state.addRouters = routers;
            state.routers = constantRouterMap.concat(routers);
        }
    },

    actions: {
        GenerateRoutes({commit}, data) {
            return new Promise(resolve => {
                if (data) {
                    const {permissions} = data;
                    const accessedRouters = asyncRouterMap.filter(v => {
                        if (hasPermission(permissions, v)) {
                            if (v.children && v.children.length > 0) {
                                v.children = v.children.filter(child => {
                                    if (hasPermission(permissions, child)) {
                                        return child
                                    }
                                    return false;
                                });
                                return v
                            } else {
                                return v
                            }
                        }
                        return false;
                    });
                    commit('SET_ROUTERS', accessedRouters);
                } else {
                    commit('SET_ROUTERS', []);
                }
                resolve();
            })
        }
    }
};


export default permission;
