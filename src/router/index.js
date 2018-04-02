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
/*  ym test start */
//const Test = () => import('../views/baseSystem/org/test');
/* ym test end */
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
// const Sort = () => import('../views/hallSystem/lobby/sort');
const Window = () => import('../views/hallSystem/lobby/window');
const NumberScope = () => import('../views/hallSystem/lobby/numberScope');
/* 会员管理 */
const LegalPersonExamined = () => import('../views/hallSystem/member/legalPersonExamined');
const NaturePerson = () => import('../views/hallSystem/member/naturePerson');
const LegalPerson = () => import('../views/hallSystem/member/legalPerson');


/* 综合窗口 */
/* 窗口收件*/
const WindowAccept = () => import('../views/hallSystem/window/receive/windowAccept');
/* 寄件待收查询*/
const SendingMaterial = () => import('../views/hallSystem/window/receive/sendingMaterial');
/* 收件记录*/
const Record = () => import('../views/hallSystem/window/receive/record');
/* 办结取件*/
const TakeAway = () => import('../views/hallSystem/window/receive/takeAway');
/* 出件管理*/
const Delivery = () => import('../views/hallSystem/window/delivery/index');
/* 快件箱管理*/
const Mailbox = () => import('../views/hallSystem/window/mailbox/index');
/* 收件地址管理*/
const Addressee = () => import('../views/hallSystem/window/addressee/index');
/* 企业信息 */
const CompanyInfo = () => import('../views/hallSystem/window/companyInfo/index');
/* 未预审 */
const Pending = () => import('../views/hallSystem/window/pretrial/pending');
/* 已预审 */
const Finish = () => import('../views/hallSystem/window/pretrial/finish');
/* 预审整改 */
const Correction = () => import('../views/hallSystem/window/pretrial/correction');
/* 预审未受理 */
const NoAccept = () => import('../views/hallSystem/window/pretrial/noAccept');
/* 街办收件 */
const WindowWork = () => import('../views/hallSystem/window/street/windowWork');
/* 街办查询 */
const WindowHistory = () => import('../views/hallSystem/window/street/windowHistory');
/* 微警认证 */
const Identification = () => import('../views/hallSystem/window/identification');

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
const EnterpriseInfoGet = () => import('../views/zwfwSystem/business/enterpriseInfoGet');
const EnterpriseInfoUp = () => import('../views/zwfwSystem/business/enterpriseInfoUp');
const FormEditor = () => import('../views/zwfwSystem/business/formEditor');
/* 统计分析 */
const CallCount = () => import('../views/hallSystem/count/callCount');
const OrderAndLine = () => import('../views/hallSystem/count/operation/orderAndLine');
const WindowHandle = () => import('../views/hallSystem/count/operation/windowHandle');
const DeptHandle = () => import('../views/hallSystem/count/operation/deptHandle');
const StaffSatisfaction = () => import('../views/hallSystem/count/operation/staffSatisfaction');
const DeptSatisfaction = () => import('../views/hallSystem/count/operation/deptSatisfaction');
const Business = () => import('../views/hallSystem/count/approval/business');

/* 数据可视化模块 */
/* 业务审批数据可视化模块 */
const BusinessApprove = () => import('../views/hallSystem/visualization/businessApprove1.vue');
/* 实时受理数据可视化模块 */
const RealTimeAccept = () => import('../views/hallSystem/visualization/realTimeAccept.vue');

/************************政务服务办理系统************************/
/* index */
const WorkSystem = () => import('../views/workSystem/index');
/* 办件管理 */
const WorkPending = () => import('../views/workSystem/process/workPending');
/* 待办事项 */
const WorkQuery = () => import('../views/workSystem/process/workQuery');
/* 办结查询 */
const WorkFinish = () => import('../views/workSystem/process/workFinish');
/* 办件查询 */
const WorkExtendTime = () => import('../views/workSystem/process/workExtendTime');
/* 延期审核管理 */
const WorkSupervise = () => import('../views/workSystem/process/workSupervise');
/* 督办管理 */

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
    },
    {
        path: '/zwfwSystem',
        component: Layout,
        name: '政务服务管理系统',
        meta: {permission: 'zwfwSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: ZwfwSystem}]
    },
    {
        path: '/workSystem',
        component: Layout,
        name: '政务业务办理系统',
        meta: {permission: 'workSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: WorkSystem}]
    },
    {
        path: '/dataShareSystem',
        component: Layout,
        name: '共享数据管理系统',
        meta: {permission: 'dataShareSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: DataShareSystem}]
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
            // {
            //     path: 'sort',
            //     component: Sort,
            //     name: '窗口分类管理 ',
            //     meta: {permission: 'hallSystem:lobby:sort:list'}
            // },
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
                path: 'legalPersonExamined',
                component: LegalPersonExamined,
                name: '法人账号审核 ',
                meta: {permission: 'hallSystem:member:legalPersonExamined:list'}
            },
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
        path: '/window',
        redirect: 'noredirect',
        name: '综合窗口',
        meta: {permission: 'hallSystem:window:admin'},
        icon: 'window',
        component: Layout,
        children: [
            {
                path: '/receive',
                component: AppMain,
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
                        path: 'sendingMaterial',
                        component: SendingMaterial,
                        name: '待收件查询',
                        meta: {permission: 'hallSystem:window:receive:record:list'}
                    }
                ]
            },
            {
                path: 'delivery',
                component: Delivery,
                name: '出件管理',
                meta: {permission: 'hallSystem:window:delivery:list'}
            },
            {
                path: 'mailbox',
                component: Mailbox,
                name: '快件箱管理',
                meta: {permission: 'hallSystem:window:mailbox:list'}
            },
            {
                path: 'addressee',
                component: Addressee,
                name: '收件地址管理',
                meta: {permission: 'hallSystem:window:addressee:list'}
            },
            {
                path: 'companyInfo',
                component: CompanyInfo,
                name: '企业信息',
                meta: {permission: 'hallSystem:window:companyInfo:list'}
            },
            {
                path: 'identification',
                component: Identification,
                name: '微警认证',
                meta: {permission: 'hallSystem:window:identification:list'}
            }
            // {path: 'windowWork', component: WindowWork, name: '街办收件'},
            // {path: 'windowHistory', component: WindowHistory, name: '办件查询'}
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
    {redirect: 'noredirect',
        name: '数据可视化',
        path:'/visualization',
        meta: {permission: 'hallSystem:visualization:admin'},
        icon: 'keshihuashuju',
        component: Layout,
        children: [
            {
                path: 'realTimeAccept',
                component: RealTimeAccept,
                name: '实时受理数据可视化',
                meta: {permission: 'hallSystem:visualization:realTimeAccept:list'}
            },
            {
                path: 'businessApprove',
                component: BusinessApprove,
                name: '业务审批数据可视化',
                meta: {permission: 'hallSystem:visualization:businessApprove:list'}
            }
        ]
    },
    /************************政务服务管理系统************************/
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
                path: 'enterpriseInfoGet',
                component: EnterpriseInfoGet,
                name: '企业信息查询',
                meta: {permission: 'zwfwSystem:business:enterpriseInfoGet:list'}
            },
            {
                path: 'enterpriseInfoUp',
                component: EnterpriseInfoUp,
                name: '企业信息管理',
                meta: {permission: 'zwfwSystem:business:EnterpriseInfoUp:list'}
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
            }
            // {
            //     path: 'formEditor',
            //     component: FormEditor,
            //     name: '表单编辑器',
            //     meta: {permission: 'zwfwSystem:business:formEditor:list'}
            // }
        ]
    },
    //ym test 广告管理
    /*{
        path: '/advert',
        redirect: 'noredirect',
        name: '广告管理',
        meta: {permission: 'zwfwSystem:advert:admin'},
        icon: 'advert',
        component: Layout,
        children: [
            {
                path: 'advertset',
                component: AdvertSet,
                name: '广告管理 ',
                meta: {permission: 'zwfwSystem:advert:advertset:list'}
            },
            {
                path: 'adcategory',
                component: AdCategory,
                name: '广告分类管理 ',
                meta: {permission: 'zwfwSystem:advert:adcategory:list'}
            },
            {
                path: 'adcategory1',
                component: AdCategory1,
                name: '广告分类管理 ',
                meta: {permission: 'zwfwSystem:advert:adcategory:list'}
            },
            {
                path: 'adcategory2',
                component: AdCategory2,
                name: '获取token ',
                meta: {permission: 'zwfwSystem:advert:adcategory:list'}
            }

        ]
    },*/
    /************************政务业务办理系统************************/
    {
        path: '/pretrial',
        component: Layout,
        icon: 'process',
        name: '预审管理',
        meta: {permission: 'workSystem:pretrial:admin'},
        children: [
            {
                path: 'pending',
                component: Pending,
                name: '待预审件',
                meta: {permission: 'workSystem:pretrial:pending:list'}
            },
            {
                path: 'correction',
                component: Correction,
                name: '整改件',
                meta: {permission: 'workSystem:pretrial:correction:list'}
            },
            {
                path: 'noAccept',
                component: NoAccept,
                name: '不予受理件',
                meta: {permission: 'workSystem:pretrial:noAccept:list'}
            },
            {
                path: 'finish',
                component: Finish,
                name: '已预审件',
                meta: {permission: 'workSystem:pretrial:finish:list'}
            }
        ]
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
                path: 'workFinish',
                component: WorkFinish,
                name: '办结查询',
                meta: {permission: 'workSystem:process:workFinish:list'}
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
            },
            {
                path: 'workFinishSupervise',
                component: WorkFinish,
                name: '待监管事项',
                meta: {permission: 'workSystem:process:workFinishSupervise:list'}
            }
        ]
    },
    /************************共享数据管理系统************************/

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
