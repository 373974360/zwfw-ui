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

/************************个人设置************************/
const Profile = () => import('../views/common/login/profile');
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
/* 业务管理 */
const Item = () => import('../views/baseSystem/business/item');
const ProcessDefinitionModel = () => import('../views/baseSystem/business/processDefinitionModel');
const ProcessDefinition = () => import('../views/baseSystem/business/processDefinition');
const TaskSetting = () => import('../views/baseSystem/business/taskSetting');
/* 办件管理 */
const WorkCreate = () => import('../views/baseSystem/process/workCreate');
const WorkPending = () => import('../views/baseSystem/process/workPending');
/* 待办事项 */
const WorkQuery = () => import('../views/baseSystem/process/workQuery');
/* 办件查询 */
/* 统计分析 */
const Business = () => import('../views/baseSystem/count/business');

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
    {path: '/authredirect', component: AuthRedirect, hidden: true},
    {path: '/sendpwd', component: SendPWD, hidden: true},
    {path: '/reset', component: Reset, hidden: true},
    {path: '/404', component: Err404, hidden: true},
    {path: '/401', component: Err401, hidden: true},
    {
        path: '/',
        component: Layout,
        redirect: '/index',
        name: '首页',
        hidden: true,
        children: [{path: 'index', component: BaseSystem}]
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
    {
        path: '/business',
        redirect: 'noredirect',
        name: '业务管理',
        meta: {permission: 'yl12345:business:admin'},
        icon: 'business',
        component: Layout,
        children: [
            {
                path: 'item',
                component: Item,
                name: '事项管理',
                meta: {permission: 'yl12345:business:item:list'}
            },
            {
                path: 'processDefinitionModel',
                component: ProcessDefinitionModel,
                name: '流程模型编辑',
                meta: {permission: 'yl12345:business:processDefinitionModel:list'}
            },
            {
                path: 'processDefinition',
                component: ProcessDefinition,
                name: '已部署流程管理',
                meta: {permission: 'yl12345:business:processDefinition:list'}
            },
            {
                path: 'taskSetting',
                component: TaskSetting,
                name: '审批节点管理',
                meta: {permission: 'yl12345:business:taskSetting:list'}
            }
        ]
    },
    {
        path: '/process',
        redirect: 'noredirect',
        name: '办件管理',
        meta: {permission: 'yl12345:process:admin'},
        icon: 'process',
        component: Layout,
        children: [
            {
                path: 'workCreate',
                component: WorkCreate,
                name: '新建办件 ',
                meta: {permission: 'yl12345:process:workCreate:list'}
            },
            {
                path: 'workPending',
                component: WorkPending,
                name: '待办事项 ',
                meta: {permission: 'yl12345:process:workPending:list'}
            },
            {
                path: 'workQuery',
                component: WorkQuery,
                name: '办件查询',
                meta: {permission: 'yl12345:process:workQuery:list'}
            }
        ]
    },
    {
        redirect: 'noredirect',
        name: '统计分析',
        path: '/analysis',
        meta: {permission: 'yl12345:count:admin'},
        icon: 'count',
        component: Layout,
        children: [
            {
                path: 'business',
                component: Business,
                name: '业务审批统计分析',
                meta: {permission: 'yl12345:count:business:list'}
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
