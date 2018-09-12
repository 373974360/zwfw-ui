import Vue from 'vue';
import Router from 'vue-router';

/* 后台布局 */
import Layout from '../views/common/layout/Layout';
import AppMain from '../views/common/layout/AppMain';

/* 登录 */
import Login from '../views/common/login/';
const AuthRedirect = () => import('../views/common/login/authredirect');
const SendPWD = () => import('../views/common/login/sendpwd');
const Reset = () => import('../views/common/login/reset');

/* 选择系统 */
import System from '../views/common/login/system';

/************************个人设置************************/
const Profile = () => import('../views/common/login/profile');

/************************基础信息管理系统************************/
/* index */
const BaseSystem = () => import('../views/baseSystem/index');
/* 组织机构 */
const Dept = () => import('../views/baseSystem/org/dept');
const User = () => import('../views/baseSystem/org/user');
const Menu = () => import('../views/baseSystem/org/menu');
const Role = () => import('../views/baseSystem/org/role');
/* 数据管理 */
const MessageFiled = () => import('../views/baseSystem/data/messageFiled');
const MessageTemplate = () => import('../views/baseSystem/data/messageTemplate');
const Dict = () => import('../views/baseSystem/data/dic');
const MetadataType = () => import('../views/baseSystem/data/metadataType');
const Holiday = () => import('../views/baseSystem/data/holiday');
/* 系统管理 */
const Cache = () => import('../views/baseSystem/setting/cache');
const Log = () => import('../views/baseSystem/setting/log');
/* 定时任务 */
const RegistryCenter = () => import('../views/baseSystem/task/registryCenter');
const TimedJob = () => import('../views/baseSystem/task/timedJob');

/************************大厅综合管理系统************************/
/* index */
const HallSystem = () => import('../views/hallSystem/index');
/* 大厅管理 */
const Window = () => import('../views/hallSystem/lobby/window');
const NumberScope = () => import('../views/hallSystem/lobby/numberScope');
const CallNumber = () => import('../views/hallSystem/lobby/callNumber.vue');

/* 业务管理 */
const Category = () => import('../views/hallSystem/business/category');
const Item = () => import('../views/hallSystem/business/item');
const Material = () => import('../views/hallSystem/business/material');

/* 统计分析 */
const CallCount = () => import('../views/hallSystem/count/callCount');
const OrderAndLine = () => import('../views/hallSystem/count/operation/orderAndLine');
const WindowHandle = () => import('../views/hallSystem/count/operation/windowHandle');
const DeptHandle = () => import('../views/hallSystem/count/operation/deptHandle');
const StaffSatisfaction = () => import('../views/hallSystem/count/operation/staffSatisfaction');
const DeptSatisfaction = () => import('../views/hallSystem/count/operation/deptSatisfaction');
const Business = () => import('../views/hallSystem/count/approval/business');

/* error page */
const Err404 = () => import('../views/common/error/404');
const Err401 = () => import('../views/common/error/401');

Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : { role: ·· }  will control the page role
 **/

export const constantRouterMap = [
    {path: '/login', component: Login, hidden: true},
    {path: '/', name: '首页', component: System, hidden: true},
    {path: '/authredirect', component: AuthRedirect, hidden: true},
    {path: '/sendpwd', component: SendPWD, hidden: true},
    {path: '/reset', component: Reset, hidden: true},
    {path: '/404', component: Err404, hidden: true},
    {path: '/401', component: Err401, hidden: true},
    {
        path: '/baseSystem',
        component: Layout,
        redirect: '/baseSystem/index',
        name: '基础信息管理系统',
        meta: {permission: 'baseSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: BaseSystem}]
    },
    {
        path: '/hallSystem',
        component: Layout,
        name: '大厅综合管理系统',
        meta: {permission: 'hallSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: HallSystem}]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [

    /************************基础信息管理系统************************/
    {
        path: '/org',
        redirect: 'noredirect',
        name: '组织机构',
        meta: {permission: 'baseSystem:org:admin'},
        icon: 'zuzhi',
        component: Layout,
        children: [
            {
                path: 'dept',
                component: Dept,
                name: '部门管理 ',
                meta: {permission: 'baseSystem:org:dept:list'}
            },
            {
                path: 'user',
                component: User,
                name: '用户管理',
                meta: {permission: 'baseSystem:org:user:list'}
            },
            {
                path: 'menu',
                component: Menu,
                name: '菜单管理',
                meta: {permission: 'baseSystem:org:menu:list'}
            },
            {
                path: 'role',
                component: Role,
                name: '角色管理',
                meta: {permission: 'baseSystem:org:role:list'}
            }
        ]
    },
    {
        path: '/data',
        redirect: 'noredirect',
        name: '数据管理',
        meta: {permission: 'baseSystem:data:admin'},
        icon: 'data',
        component: Layout,
        children: [
            {
                path: 'messageFiled',
                component: MessageFiled,
                name: '短信字段管理',
                meta: {permission: 'baseSystem:data:messageFiled:list'}
            },
            {
                path: 'messageTemplate',
                component: MessageTemplate,
                name: '短信模板管理',
                meta: {permission: 'baseSystem:data:messageTemplate:list'}
            },
            {
                path: 'dict',
                component: Dict,
                name: '数据字典',
                meta: {permission: 'baseSystem:data:dicIndex:list'}
            },
            {
                path: 'metadataType',
                component: MetadataType,
                name: '元数据类型',
                meta: {permission: 'baseSystem:data:metadataType:list'}
            },
            {
                path: 'holiday',
                component: Holiday,
                name: '节假日管理',
                meta: {permission: 'baseSystem:data:holiday:list'}
            }
        ]
    },
    {
        path: '/setting',
        redirect: 'noredirect',
        name: '系统管理',
        meta: {permission: 'baseSystem:setting:admin'},
        icon: 'system',
        component: Layout,
        children: [
            {
                path: 'cache',
                component: Cache,
                name: '缓存管理',
                meta: {permission: 'baseSystem:setting:cache:list'}
            },
            {
                path: 'log',
                component: Log,
                name: '日志管理',
                meta: {permission: 'baseSystem:setting:log:list'}
            }
        ]
    },
    /************************大厅综合管理系统************************/
    {
        path: '/lobby',
        redirect: 'noredirect',
        name: '大厅管理',
        meta: {permission: 'hallSystem:lobby:admin'},
        icon: 'lobby',
        component: Layout,
        children: [
            {
                path: 'window',
                component: Window,
                name: '窗口管理 ',
                meta: {permission: 'hallSystem:lobby:window:list'}
            },
            {
                path: 'numberScope',
                component: NumberScope,
                name: '抽号管理',
                meta: {permission: 'hallSystem:lobby:numberScope:list'}
            },
            {
                path: 'callNumber',
                component: CallNumber,
                name: '叫号管理',
                meta: {permission: 'hallSystem:lobby:callNumber:list'}
            }
        ]
    },
    {
        path: '/business',
        redirect: 'noredirect',
        name: '业务管理',
        meta: {permission: 'hallSystem:business:admin'},
        icon: 'business',
        component: Layout,
        children: [
            {
                path: 'category',
                component: Category,
                name: '事项分类管理 ',
                meta: {permission: 'hallSystem:business:category:list'}
            },
            {
                path: 'material',
                component: Material,
                name: '材料管理',
                meta: {permission: 'hallSystem:business:material:list'}
            },
            {
                path: 'item',
                component: Item,
                name: '事项管理',
                meta: {permission: 'hallSystem:business:item:list'}
            }
        ]
    },
    {redirect: 'noredirect',
        name: '统计分析',
        path:'/analysis',
        meta: {permission: 'hallSystem:count:admin'},
        icon: 'count',
        component: Layout,
        children: [
            {
                path: '/operation',
                component: AppMain,
                name: '大厅日常运营',
                meta: {permission: 'hallSystem:count:operation:admin'},
                children: [
                    {
                        path: 'orderAndLine',
                        component: OrderAndLine,
                        name: '预约排队统计',
                        meta: {permission: 'hallSystem:count:operation:orderAndLine:list'}
                    },
                    {
                        path: 'windowHandle',
                        component: WindowHandle,
                        name: '窗口受理量',
                        meta: {permission: 'hallSystem:count:operation:windowHandle:list'}
                    },
                    {
                        path: 'deptHandle',
                        component: DeptHandle,
                        name: '部门受理量',
                        meta: {permission: 'hallSystem:count:operation:deptHandle:list'}
                    },
                    {
                        path: 'staffSatisfaction',
                        component: StaffSatisfaction,
                        name: '五星级服务员',
                        meta: {permission: 'hallSystem:count:operation:staffSatisfaction:list'}
                    },
                    {
                        path: 'deptSatisfaction',
                        component: DeptSatisfaction,
                        name: '服务满意度统计',
                        meta: {permission: 'hallSystem:count:operation:deptSatisfaction:list'}
                    }
                ]
            },
            {
                path: '/approval',
                component: AppMain,
                name: '受理审批分析',
                meta: {permission: 'hallSystem:count:approval:admin'},
                children: [
                    {
                        path: 'business',
                        component: Business,
                        name: '业务审批统计分析',
                        meta: {permission: 'hallSystem:count:approval:business:list'}
                    }
                ]
            },
            {
                path: 'callCount',
                component: CallCount,
                name: '叫号统计 ',
                meta: {permission: 'hallSystem:count:callCount:list'}
            }
        ]
    },
    /*************************404页面******************************/
    {path: '*', redirect: '/404', hidden: true},
    /*************************个人设置 修改个人信息******************************/
    {
        hidden: true,
        name: '个人设置',
        path: '/admin',
        component: Layout,
        children: [
            {
                name: '修改资料',
                path: 'profile',
                component: Profile
            }
        ]
    }
];
