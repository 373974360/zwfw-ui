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
/* 会员管理 */
const NaturePerson = () => import('../views/hallSystem/member/naturePerson');
const LegalPerson = () => import('../views/hallSystem/member/legalPerson');
/* 综合窗口 */
const WindowAccept = () => import('../views/hallSystem/window/receive/windowAccept');  /* 窗口收件*/
const Record = () => import('../views/hallSystem/window/receive/record');    /* 收件记录*/
const TakeAway = () => import('../views/hallSystem/window/receive/takeAway');  /* 办结取件*/
const Pending = () => import('../views/hallSystem/window/pretrial/pending'); /* 未预审 */
const Finish = () => import('../views/hallSystem/window/pretrial/finish');   /* 已预审 */
const Correction = () => import('../views/hallSystem/window/pretrial/correction');   /* 预审整改 */
const NoAccept = () => import('../views/hallSystem/window/pretrial/noAccept');   /* 预审未受理 */
const WindowWork = () => import('../views/hallSystem/window/street/windowWork');    /* 街办收件 */
const WindowHistory = () => import('../views/hallSystem/window/street/windowHistory');  /* 街办查询 */

/************************政务服务管理系统************************/
/* index */
const ZwfwSystem = () => import('../views/zwfwSystem/index');
/* 业务管理 */
const Category = () => import('../views/zwfwSystem/business/category');
const Material = () => import('../views/zwfwSystem/business/material');
const Item = () => import('../views/zwfwSystem/business/item');
const ProcessDefinitionModel = () => import('../views/zwfwSystem/business/processDefinitionModel');
const ProcessDefinition = () => import('../views/zwfwSystem/business/processDefinition');
const TaskSetting = () => import('../views/zwfwSystem/business/taskSetting');
const FormEditor = () => import('../views/zwfwSystem/business/formEditor');
/* 统计分析 */
const CallCount = () => import('../views/hallSystem/count/callCount');

/************************政务服务办理系统************************/
/* index */
const WorkSystem = () => import('../views/workSystem/index');
/* 办件管理 */
const WorkPending = () => import('../views/workSystem/process/workPending'); /* 待办事项 */
const WorkQuery = () => import('../views/workSystem/process/workQuery'); /* 办件查询 */
const WorkExtendTime = () => import('../views/workSystem/process/workExtendTime');   /* 延期审核管理 */
const WorkSupervise = () => import('../views/workSystem/process/workSupervise'); /* 督办管理 */

/************************共享数据管理系统************************/
/* index */
const DataShareSystem = () => import('../views/dataShareSystem/index');

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
        meta: {permission: 'baseSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: BaseSystem}]
    },
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
        path: 'setting',
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
        path: '/hallSystem',
        component: Layout,
        redirect: '/hallSystem/index',
        name: '大厅综合管理系统',
        meta: {permission: 'hallSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: HallSystem}]
    },
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
            }
        ]
    },
    {
        path: '/member',
        redirect: 'noredirect',
        name: '会员管理',
        meta: {permission: 'hallSystem:member:admin'},
        icon: 'member',
        component: Layout,
        children: [
            {
                path: 'naturePerson',
                component: NaturePerson,
                name: '自然人管理 ',
                meta: {permission: 'hallSystem:member:naturePerson:list'}
            },
            {
                path: 'legalPerson',
                component: LegalPerson,
                name: '法人管理',
                meta: {permission: 'hallSystem:member:legalPerson:list'}
            }
        ]
    },
    {
        path: 'window',
        redirect: 'noredirect',
        name: '综合窗口',
        meta: {permission: 'hallSystem:window:admin'},
        icon: 'window',
        component: Layout,
        children: [
            {
                path: '/pretrial',
                name: '预审管理',
                component: AppMain,
                meta: {permission: 'hallSystem:window:pretrial:admin'},
				children: [
					{
						path: 'pending',
						component: Pending,
						name: '待预审件',
						meta: {permission: 'hallSystem:window:pretrial:pending:list'}
					},
					{
						path: 'correction',
						component: Correction,
						name: '整改件',
						meta: {permission: 'hallSystem:window:pretrial:correction:list'}
					},
					{
						path: 'noAccept',
						component: NoAccept,
						name: '不予受理件',
						meta: {permission: 'hallSystem:window:pretrial:noAccept:list'}
					},
					{
						path: 'finish',
						component: Finish,
						name: '已预审件',
						meta: {permission: 'hallSystem:window:pretrial:finish:list'}
					}
				]
            },
            {
                path: 'receive',
                component: Layout,
                name: '收件管理',
                meta: {permission: 'hallSystem:window:receive:admin'},
				children: [
					{
						path: 'windowAccept',
						component: WindowAccept,
						name: '窗口收件',
						meta: {permission: 'hallSystem:window:receive:windowAccept:list'}
					},
					{
						path: 'record',
						component: Record,
						name: '收件记录',
						meta: {permission: 'hallSystem:window:receive:record:list'}
					},
					{
						path: 'takeAway',
						component: TakeAway,
						name: '办结取件',
						meta: {permission: 'hallSystem:window:receive:takeAway:list'}
					}
				]
            },
			{path: 'windowWork', component: WindowWork, name: '街办收件'},
            {path: 'windowHistory', component: WindowHistory, name: '办件查询'}
        ]
    },
    {
        path: '/count',
        redirect: 'noredirect',
        name: '统计分析',
        meta: {permission: 'hallSystem:count:admin'},
        icon: 'count',
        component: Layout,
        children: [
            {
                path: 'callCount',
                component: CallCount,
                name: '叫号统计 ',
                meta: {permission: 'hallSystem:count:callCount:list'}
            }
        ]
    },
    /************************政务服务管理系统************************/
    {
        path: '/zwfwSystem',
        component: Layout,
        redirect: '/zwfwSystem/index',
        name: '政务服务管理系统',
		meta: {permission: 'zwfwSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: ZwfwSystem}]
    },
    {
        path: '/business',
        redirect: 'noredirect',
        name: '业务管理',
        meta: {permission: 'zwfwSystem:business:admin'},
        icon: 'business',
        component: Layout,
        children: [
            {
                path: 'category',
                component: Category,
                name: '事项分类管理 ',
                meta: {permission: 'zwfwSystem:business:category:list'}
            },
            {
                path: 'material',
                component: Material,
                name: '材料管理',
                meta: {permission: 'zwfwSystem:business:material:list'}
            },
            {
                path: 'item',
                component: Item,
                name: '事项管理',
                meta: {permission: 'zwfwSystem:business:item:list'}
            },
            {
                path: 'processDefinitionModel',
                component: ProcessDefinitionModel,
                name: '流程模型编辑',
                meta: {permission: 'zwfwSystem:business:processDefinitionModel:list'}
            },
            {
                path: 'processDefinition',
                component: ProcessDefinition,
                name: '已部署流程管理',
                meta: {permission: 'zwfwSystem:business:processDefinition:list'}
            },
            {
                path: 'taskSetting',
                component: TaskSetting,
                name: '审批节点管理',
                meta: {permission: 'zwfwSystem:business:taskSetting:list'}
            },
            {
                path: 'formEditor',
                component: FormEditor,
                name: '表单编辑器',
                meta: {permission: 'zwfwSystem:business:formEditor:list'}
            }
        ]
    },
    /************************政务业务办理系统************************/
    {
        path: '/workSystem',
        component: Layout,
        redirect: '/workSystem/index',
        name: '政务业务办理系统',
		meta: {permission: 'workSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: WorkSystem}]
    },
    {
        path: '/process',
        redirect: 'noredirect',
        name: '办件管理',
        meta: {permission: 'workSystem:process:admin'},
        icon: 'process',
        component: Layout,
        children: [
            {
                path: 'workPending',
                component: WorkPending,
                name: '待办事项 ',
                meta: {permission: 'workSystem:process:workPending:list'}
            },
            {
                path: 'workQuery',
                component: WorkQuery,
                name: '办件查询',
                meta: {permission: 'workSystem:process:workQuery:list'}
            },
            {
                path: 'workExtendTime',
                component: WorkExtendTime,
                name: '延期批准',
                meta: {permission: 'workSystem:process:workExtendTime:list'}
            },
            {
                path: 'workSupervise',
                component: WorkSupervise,
                name: '督办管理',
                meta: {permission: 'workSystem:process:workSupervise:list'}
            }
        ]
    },
    /************************共享数据管理系统************************/
    {
        path: '/dataShareSystem',
        component: Layout,
        redirect: '/dataShareSystem/index',
        name: '共享数据管理系统',
		meta: {permission: 'dataShareSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: DataShareSystem}]
    },
    /*************************404页面******************************/
    {path: '*', redirect: '/404', hidden: true}
];
