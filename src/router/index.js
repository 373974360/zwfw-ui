import Vue from 'vue';
import Router from 'vue-router';

/* 后台布局 */
import Layout from '../views/common/layout/Layout';

/* 登录 */
import Login from '../views/common/login/';
const AuthRedirect = () => import('../views/common/login/authredirect');
const SendPWD = () => import('../views/common/login/sendpwd');
const Reset = () => import('../views/common/login/reset');

/* 选择系统 */
import System from '../views/common/login/system';

/************************基础信息管理系统************************/
/* index */
const BaseSystem = () => import('../views/base/index');
/* 组织机构 */
const Dept = () => import('../views/base/org/dept');
const User = () => import('../views/base/org/user');
const Menu = () => import('../views/base/org/menu');
const Role = () => import('../views/base/org/role');
/* 数据管理 */
const MessageFiled = () => import('../views/base/data/messageFiled');
const MessageTemplate = () => import('../views/base/data/messageTemplate');
const Dict = () => import('../views/base/data/dict');
const MetadataType = () => import('../views/base/data/metadataType');
const Holiday = () => import('../views/base/data/holiday');
/* 系统管理 */
const Cache = () => import('../views/base/system/cache');
const Log = () => import('../views/base/system/log');
/* 定时任务 */
const RegistryCenter = () => import('../views/base/task/registryCenter');
const TimedJob = () => import('../views/base/task/timedJob');

/************************大厅综合管理系统************************/
/* index */
const HallSystem = () => import('../views/hall/index');
/* 大厅管理 */
const Window = () => import('../views/hall/lobby/window');
const NumberScope = () => import('../views/hall/lobby/numberScope');
/* 会员管理 */
const NaturePerson = () => import('../views/hall/member/naturePerson');
const LegalPerson = () => import('../views/hall/member/legalPerson');
/* 综合窗口 */
const CompositeWindowWork = () => import('../views/hall/window/hall/CompositeWindowWork');  /* 窗口收件*/
const CompositeWindowHistory = () => import('../views/hall/window/hall/CompositeWindowHistory');    /* 受理记录*/
const CompositeWindowTakeCert = () => import('../views/hall/window/hall/CompositeWindowTakeCert');  /* 办结取件*/
const Pending = () => import('../views/hall/window/pretrial/pending'); /* 未预审 */
const Finish = () => import('../views/hall/window/pretrial/finish');   /* 已预审 */
const Correction = () => import('../views/hall/window/pretrial/correction');   /* 预审整改 */
const NoAccept = () => import('../views/hall/window/pretrial/noAccept');   /* 预审未受理 */
const WindowWork = () => import('../views/hall/window/street/windowWork');    /* 街办收件 */
const WindowHistory = () => import('../views/hall/window/street/windowHistory');  /* 街办查询 */

/************************政务服务管理系统************************/
/* index */
const ZwfwSystem = () => import('../views/zwfw/index');
/* 业务管理 */
const Category = () => import('../views/zwfw/business/category');
const Material = () => import('../views/zwfw/business/material');
const Item = () => import('../views/zwfw/business/item');
const ProcessDefinitionModel = () => import('../views/zwfw/business/processDefinitionModel');
const ProcessDefinition = () => import('../views/zwfw/business/processDefinition');
const TaskSetting = () => import('../views/zwfw/business/taskSetting');
const FormEditor = () => import('../views/zwfw/business/formEditor');
/* 统计分析 */
const CallCount = () => import('../views/zwfw/count/callCount');

/************************政务服务办理系统************************/
/* index */
const WorkSystem = () => import('../views/work/index');
/* 办件管理 */
const WorkPending = () => import('../views/work/process/workPending'); /* 待办事项 */
const WorkQuery = () => import('../views/work/process/workQuery'); /* 办件查询 */
const WorkExtendTime = () => import('../views/work/process/workExtendTime');   /* 延期审核管理 */
const WorkSupervise = () => import('../views/work/process/workSupervise'); /* 督办管理 */

/************************共享数据管理系统************************/
/* index */
const DataShareSystem = () => import('../views/dataShare/index');

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
    {path: '/401', component: Err401, hidden: true}
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [

    /************************基础信息管理系统************************/
    {
        path: '/baseSystem',
        component: Layout,
        redirect: '/baseSystem/index',
        name: '基础信息管理系统',
        hidden: true,
        children: [{path: 'index', component: BaseSystem}]
    },
    {
        path: '/org',
        redirect: 'noredirect',
        name: '组织机构',
        meta: {permission: ''},
        icon: 'zuzhi',
        component: Layout,
        children: [
            {
                path: 'dept',
                component: Dept,
                name: '部门管理 ',
                meta: {permission: ''}
            },
            {
                path: 'user',
                component: User,
                name: '用户管理',
                meta: {permission: ''}
            },
            {
                path: 'menu',
                component: Menu,
                name: '菜单管理',
                meta: {permission: ''}
            },
            {
                path: 'role',
                component: Role,
                name: '角色管理',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: '/data',
        redirect: 'noredirect',
        name: '数据管理',
        meta: {permission: ''},
        icon: 'data',
        component: Layout,
        children: [
            {
                path: 'messageFiled',
                component: MessageFiled,
                name: '短信字段管理',
                meta: {permission: ''}
            },
            {
                path: 'messageTemplate',
                component: MessageTemplate,
                name: '短信模板管理',
                meta: {permission: ''}
            },
            {
                path: 'dict',
                component: Dict,
                name: '数据字典',
                meta: {permission: ''}
            },
            {
                path: 'metadataType',
                component: MetadataType,
                name: '元数据类型',
                meta: {permission: ''}
            },
            {
                path: 'holiday',
                component: Holiday,
                name: '节假日管理',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: 'system',
        redirect: 'noredirect',
        name: '系统管理',
        meta: {permission: ''},
        icon: 'system',
        component: Layout,
        children: [
            {
                path: 'cache',
                component: Cache,
                name: '缓存管理',
                meta: {permission: ''}
            },
            {
                path: 'log',
                component: Log,
                name: '日志管理',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: '/task',
        component: Layout,
        redirect: 'noredirect',
        name: '任务管理',
        icon: 'ling',
        children: [
            {
                path: 'registryCenter',
                component: RegistryCenter,
                name: '注册中心',
                meta: {permission: ''}
            },
            {
                path: 'timedJob',
                component: TimedJob,
                name: '定时任务',
                meta: {permission: ''}
            }
        ]
    },
    /************************大厅综合管理系统************************/
    {
        path: '/hallSystem',
        component: Layout,
        redirect: '/hallSystem/index',
        name: '大厅综合管理系统',
        hidden: true,
        children: [{path: 'index', component: HallSystem}]
    },
    {
        path: '/lobby',
        redirect: 'noredirect',
        name: '大厅管理',
        meta: {permission: ''},
        icon: 'lobby',
        component: Layout,
        children: [
            {
                path: 'window',
                component: Window,
                name: '窗口管理 ',
                meta: {permission: ''}
            },
            {
                path: 'numberScope',
                component: NumberScope,
                name: '抽号管理',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: '/member',
        redirect: 'noredirect',
        name: '会员管理',
        meta: {permission: ''},
        icon: 'member',
        component: Layout,
        children: [
            {
                path: 'naturePerson',
                component: NaturePerson,
                name: '自然人管理 ',
                meta: {permission: ''}
            },
            {
                path: 'legalPerson',
                component: LegalPerson,
                name: '法人管理',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: '/window',
        redirect: 'noredirect',
        name: '综合窗口',
        meta: {permission: ''},
        icon: 'window',
        component: Layout,
        children: [
            {path: 'pending', component: Pending, name: '待预审件 '},
            {path: 'finish', component: Finish, name: '已预审件'},
            {path: 'correction', component: Correction, name: '整改件'},
            {path: 'noAccept', component: NoAccept, name: '不予受理件'},
            {path: 'work', component: CompositeWindowWork, name: '窗口收件'},
            {path: 'history', component: CompositeWindowHistory, name: '受理记录'},
            {path: 'takeCert', component: CompositeWindowTakeCert, name: '办结取件'},
            {path: 'windowWork', component: WindowWork, name: '街办收件'},
            {path: 'windowHistory', component: WindowHistory, name: '办件查询'},
            /*{
                path: 'pending',
                component: Pending,
                name: '预审管理 ',
                meta: {permission: ''}
            },
            {
                path: 'work',
                component: CompositeWindowWork,
                name: '收件管理',
                meta: {permission: ''}
            }*/
        ]
    },
    /************************政务服务管理系统************************/
    {
        path: '/zwfwSystem',
        component: Layout,
        redirect: '/zwfwSystem/index',
        name: '政务服务管理系统',
        hidden: true,
        children: [{path: 'index', component: ZwfwSystem}]
    },
    {
        path: '/business',
        redirect: 'noredirect',
        name: '业务管理',
        meta: {permission: ''},
        icon: 'business',
        component: Layout,
        children: [
            {
                path: 'category',
                component: Category,
                name: '事项分类管理 ',
                meta: {permission: ''}
            },
            {
                path: 'material',
                component: Material,
                name: '材料管理',
                meta: {permission: ''}
            },
            {
                path: 'item',
                component: Item,
                name: '事项管理',
                meta: {permission: ''}
            },
            {
                path: 'processDefinitionModel',
                component: ProcessDefinitionModel,
                name: '流程模型编辑',
                meta: {permission: ''}
            },
            {
                path: 'processDefinition',
                component: ProcessDefinition,
                name: '已部署流程管理',
                meta: {permission: ''}
            },
            {
                path: 'taskSetting',
                component: TaskSetting,
                name: '审批节点管理',
                meta: {permission: ''}
            },
            {
                path: 'formEditor',
                component: FormEditor,
                name: '表单编辑器',
                meta: {permission: ''}
            }
        ]
    },
    {
        path: '/count',
        redirect: 'noredirect',
        name: '统计分析',
        meta: {permission: ''},
        icon: 'count',
        component: Layout,
        children: [
            {
                path: 'callCount',
                component: CallCount,
                name: '叫号统计 ',
                meta: {permission: ''}
            }
        ]
    },
    /************************政务业务办理系统************************/
    {
        path: '/workSystem',
        component: Layout,
        redirect: '/workSystem/index',
        name: '政务业务办理系统',
        hidden: true,
        children: [{path: 'index', component: WorkSystem}]
    },
    {
        path: '/process',
        redirect: 'noredirect',
        name: '办件管理',
        meta: {permission: ''},
        icon: 'process',
        component: Layout,
        children: [
            {
                path: 'workPending',
                component: WorkPending,
                name: '待办事项 ',
                meta: {permission: ''}
            },
            {
                path: 'workQuery',
                component: WorkQuery,
                name: '办件查询',
                meta: {permission: ''}
            },
            {
                path: 'workExtendTime',
                component: WorkExtendTime,
                name: '延期批准',
                meta: {permission: ''}
            },
            {
                path: 'workSupervise',
                component: WorkSupervise,
                name: '督办管理',
                meta: {permission: ''}
            }
        ]
    },
    /************************共享数据管理系统************************/
    {
        path: '/dataShareSystem',
        component: Layout,
        redirect: '/dataShareSystem/index',
        name: '共享数据管理系统',
        hidden: true,
        children: [{path: 'index', component: DataShareSystem}]
    },
    /*************************404页面******************************/
    {path: '*', redirect: '/404', hidden: true}
];
