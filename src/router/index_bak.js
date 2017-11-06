import Vue from 'vue';
import Router from 'vue-router';
/* layout */
import Layout from '../views/common/layout/Layout';
/* login */
import Login from '../views/common/login/';
import System from '../views/common/login/system';

const authRedirect = () => import('../views/login/authredirect');
const sendPWD = () => import('../views/login/sendpwd');
const reset = () => import('../views/login/reset');

/* dashboard */
const dashboard = () => import('../views/dashboard/index');

/* org */
const Dept = () => import('../views/sys/org/dept');
const User = () => import('../views/sys/org/user');
const Menu = () => import('../views/sys/org/menu');
const Role = () => import('../views/sys/org/role');

/* system */
const Holiday = () => import('../views/sys/system/holiday');
const Log = () => import('../views/sys/system/log');
const Cache = () => import('../views/sys/system/cache');
const Dict = () => import('../views/sys/system/dic');
const MetadataType = () => import('../views/sys/system/metadataType');
const SysMessageFiled = () => import('../views/sys/system/sysMessageFiled');
const SysMessageTemplate = () => import('../views/sys/system/SysMessageTemplate');

/* zwfw */
const Category = () => import('../views/zwfw/category');
const Item = () => import('../views/zwfw/zwfwItem');
const Window = () => import('../views/zwfw/window');
const Material = () => import('../views/zwfw/zwfwMaterial');
const FormEditor = () => import('../views/zwfw/formEditor/editor');
const LegalPerson = () => import('../views/zwfw/zwfwLegalPerson');
const NaturePerson = () => import('../views/zwfw/zwfwNaturePerson');
const ZwfwProcessDefinitionModel = () => import('../views/zwfw/activiti/zwfwProcessDefinitionModel');
const ZwfwProcessDefinition = () => import('../views/zwfw/activiti/ZwfwProcessDefinition');
const ZwfwTaskSetting = () => import('../views/zwfw/activiti/ZwfwTaskSetting');
const ZwfwNumberScope = () => import('../views/zwfw/zwfwNumberScope');

/* 部门待办列表*/
const DeptWorkPendingList = () => import('../views/zwfw/work/deptWorkPendingList');
/* 部门办件查询*/
const DeptWorkQueryList = () => import('../views/zwfw/work/deptWorkQueryList');


/* 综合窗口 - 窗口收件*/
const CompositeWindowWork = () => import('../views/zwfw/hall/CompositeWindowWork');
/* 综合窗口 - 受理记录*/
const CompositeWindowHistory = () => import('../views/zwfw/hall/CompositeWindowHistory');
/* 综合窗口 - 办结取件*/
const CompositeWindowTakeCert = () => import('../views/zwfw/hall/CompositeWindowTakeCert');
/* 办件管理 - 延期审核管理*/
const DeptWorkExtendTimeList = () => import('../views/zwfw/work/deptExtendTimeList');
/* 办件管理 - 督办管理*/
const DeptWorkSuperviseList = () => import('../views/zwfw/work/deptSuperviseList');


/* 定时任务 */
const RegistryCenter = () => import('../views/task/registryCenter');
const Task = () => import('../views/task/task');

/* 统计分析 */
const Call = () => import('../views/zwfw/count/call');

/* 网上预审 */
const Pending = () => import('../views/zwfw/pretrial/pending');
const Finish = () => import('../views/zwfw/pretrial/finish');
const Correction = () => import('../views/zwfw/pretrial/correction');
const NoAccept = () => import('../views/zwfw/pretrial/noAccept');
/* 街办业务 */
const WindowWork = () => import('../views/streetoffice/windowWork');
const WindowHistory = () => import('../views/streetoffice/windowHistory');


/* components */
const componentsIndex = () => import('../views/components/index');
const Tinymce = () => import('../views/components/tinymce');
const Markdown = () => import('../views/components/markdown');
const JsonEditor = () => import('../views/components/jsoneditor');
const DndList = () => import('../views/components/dndlist');
const AvatarUpload = () => import('../views/components/avatarUpload');
const Dropzone = () => import('../views/components/dropzone');
const Sticky = () => import('../views/components/sticky');
const SplitPane = () => import('../views/components/splitpane');
const CountTo = () => import('../views/components/countTo');
const Mixin = () => import('../views/components/mixin');


/* charts */
const chartIndex = () => import('../views/charts/index');
const KeyboardChart = () => import('../views/charts/keyboard');
const KeyboardChart2 = () => import('../views/charts/keyboard2');
const LineMarker = () => import('../views/charts/line');
const MixChart = () => import('../views/charts/mixchart');

/* error page */
const Err404 = () => import('../views/error/404');
const Err401 = () => import('../views/error/401');

/* error log */
const ErrorLog = () => import('../views/errlog/index');

/* excel */
const ExcelDownload = () => import('../views/excel/index');

/* theme  */
const Theme = () => import('../views/theme/index');

/* example*/
const TableLayout = () => import('../views/example/table/index');
const DynamicTable = () => import('../views/example/table/dynamictable');
const Table = () => import('../views/example/table/table');
const DragTable = () => import('../views/example/table/dragTable');
const InlineEditTable = () => import('../views/example/table/inlineEditTable');
const Form1 = () => import('../views/example/form1');


Vue.use(Router);

/**
 * icon : the icon show in the sidebar
 * hidden : if hidden:true will not show in the sidebar
 * redirect : if redirect:noredirect will not redirct in the levelbar
 * noDropdown : if noDropdown:true will not has submenu
 * meta : { role: ['admin'] }  will control the page role
 **/

export const constantRouterMap = [
    {path: '/login', component: Login, hidden: true},
    {path: '/System', component: System, hidden: true},
    {path: '/authredirect', component: authRedirect, hidden: true},
    {path: '/sendpwd', component: sendPWD, hidden: true},
    {path: '/reset', component: reset, hidden: true},
    {path: '/404', component: Err404, hidden: true},
    {path: '/401', component: Err401, hidden: true},
    {
        path: '/',
        component: Layout,
        redirect: '/dashboard',
        name: '首页',
        hidden: true,
        children: [{path: 'dashboard', component: dashboard}]
    }
]

export default new Router({
    // mode: 'history', //后端支持可开
    scrollBehavior: () => ({y: 0}),
    routes: constantRouterMap
});

export const asyncRouterMap = [
    {
        path: '/org',
        component: Layout,
        redirect: 'noredirect',
        name: '组织机构',
        icon: 'zuzhi',
        children: [
            {path: 'dept', component: Dept, name: '部门管理 '},
            {path: 'user', component: User, name: '用户管理'},
            {path: 'menu', component: Menu, name: '菜单管理'},
            {path: 'role', component: Role, name: '角色管理'}
        ]
    },
    {
        path: '/pretrial',
        component: Layout,
        redirect: 'noredirect',
        name: '网上预审',
        icon: 'shenpi',
        children: [
            {path: 'pending', component: Pending, name: '待预审件 '},
            {path: 'finish', component: Finish, name: '已预审件'},
            {path: 'correction', component: Correction, name: '整改件'},
            {path: 'noAccept', component: NoAccept, name: '不予受理件'}
        ]
    },
    {
        path: '/system',
        component: Layout,
        redirect: 'noredirect',
        name: '系统管理',
        icon: 'system',
        children: [
            {path: 'metadataType', component: MetadataType, name: '元数据类型'},
            {path: 'dic', component: Dict, name: '数据字典'},
            {path: 'cache', component: Cache, name: '缓存管理'},
            {path: 'sysMessageFiled', component: SysMessageFiled, name: '短信字段管理'},
            {path: 'sysMessageTemplate', component: SysMessageTemplate, name: '短信模板管理'},
            {path: 'date', component: Holiday, name: '节假日管理'},
            {path: 'log', component: Log, name: '日志管理'}
        ]
    },
    {
        path: '/task',
        component: Layout,
        redirect: 'noredirect',
        name: '任务管理',
        icon: 'ling',
        children: [
            {path: 'registryCenter', component: RegistryCenter, name: '注册中心'},
            {path: 'task', component: Task, name: '定时任务'}
        ]
    },
    {
        path: '/operate',
        component: Layout,
        redirect: 'noredirect',
        name: '业务管理',
        icon: 'yewuguanli',
        children: [
            {path: 'category', component: Category, name: '事项分类管理'},
            {path: 'window', component: Window, name: '窗口管理'},
            {path: 'formEditor', component: FormEditor, name: '表单编辑器'},
            {path: 'zwfwItem', component: Item, name: '事项管理'},
            {path: 'zwfwMaterial', component: Material, name: '材料管理'},
            {path: 'zwfwNumberScope', component: ZwfwNumberScope, name: '抽号管理'},
            {path: 'zwfwLegalPerson', component: LegalPerson, name: '法人管理'},
            {path: 'zwfwNaturePerson', component: NaturePerson, name: '自然人管理'},
            {path: 'zwfwProcessDefinitionModel', component: ZwfwProcessDefinitionModel, name: '流程模型编辑'},
            {path: 'zwfwProcessDefinition', component: ZwfwProcessDefinition, name: '已部署流程管理'},
            {path: 'zwfwUserTaskSetting', component: ZwfwTaskSetting, name: '审批节点管理'},
            // {path: 'zwfwProcessInstance', component: ZwfwProcessDefinitionModel, name: '已部署流程管理'},

        ]
    },
    {
        path: '/compositeWindow',
        component: Layout,
        redirect: 'noredirect',
        name: '综合窗口',
        icon: 'yewuguanli',
        children: [
            {path: 'work', component: CompositeWindowWork, name: '窗口收件'},
            {path: 'history', component: CompositeWindowHistory, name: '受理记录'},
            {path: 'takeCert', component: CompositeWindowTakeCert, name: '办结取件'}

        ]
    }, {
        path: '/work',
        component: Layout,
        redirect: 'noredirect',
        name: '办件管理',
        icon: 'yewuguanli',
        children: [
            {path: 'deptWorkPending', component: DeptWorkPendingList, name: '待办事项'},
            {path: 'deptWorkQuery', component: DeptWorkQueryList, name: '办件查询'},
            {path: 'deptWorkExtendTime', component: DeptWorkExtendTimeList, name: '延期批准'},
            {path: 'deptWorkSupervise', component: DeptWorkSuperviseList, name: '督办管理'}
        ]
    }, {
        path: '/count',
        component: Layout,
        redirect: 'noredirect',
        name: '统计分析',
        icon: 'statisticalAnalysis',
        children: [
            {path: 'call', component: Call, name: '叫号统计'}
        ]
    },
    {
        path: '/streetOffice',
        component: Layout,
        redirect: 'noredirect',
        name: '街办业务',
        icon: 'icon-weixin',
        children: [
            {path: 'windowWork', component: WindowWork, name: '街办收件'},
            {path: 'windowHistory', component: WindowHistory, name: '办件查询'}
        ]
    },
    {
        path: '/components',
        component: Layout,
        redirect: '/components/index',
        name: '组件',
        icon: 'zujian',
        children: [
            {path: 'index', component: componentsIndex, name: '介绍 '},
            {path: 'tinymce', component: Tinymce, name: '富文本编辑器'},
            {path: 'markdown', component: Markdown, name: 'Markdown'},
            {path: 'jsoneditor', component: JsonEditor, name: 'JSON编辑器'},
            {path: 'dndlist', component: DndList, name: '列表拖拽'},
            {path: 'splitpane', component: SplitPane, name: 'SplitPane'},
            {path: 'avatarupload', component: AvatarUpload, name: '头像上传'},
            {path: 'dropzone', component: Dropzone, name: 'Dropzone'},
            {path: 'sticky', component: Sticky, name: 'Sticky'},
            {path: 'countto', component: CountTo, name: 'CountTo'},
            {path: 'mixin', component: Mixin, name: '小组件'}
        ]
    },
    {
        path: '/charts',
        component: Layout,
        redirect: '/charts/index',
        name: '图表',
        icon: 'tubiaoleixingzhengchang',
        children: [
            {path: 'index', component: chartIndex, name: '介绍'},
            {path: 'keyboard', component: KeyboardChart, name: '键盘图表'},
            {path: 'keyboard2', component: KeyboardChart2, name: '键盘图表2'},
            {path: 'line', component: LineMarker, name: '折线图'},
            {path: 'mixchart', component: MixChart, name: '混合图表'}
        ]
    },
    {
        path: '/errorpage',
        component: Layout,
        redirect: 'noredirect',
        name: '错误页面',
        icon: '404',
        children: [
            {path: '401', component: Err401, name: '401'},
            {path: '404', component: Err404, name: '404'}
        ]
    },
    {
        path: '/errlog',
        component: Layout,
        redirect: 'noredirect',
        name: 'errlog',
        icon: 'bug',
        noDropdown: true,
        children: [{path: 'log', component: ErrorLog, name: '错误日志'}]
    },
    {
        path: '/excel',
        component: Layout,
        redirect: 'noredirect',
        name: 'excel',
        icon: 'EXCEL',
        noDropdown: true,
        children: [{path: 'download', component: ExcelDownload, name: '导出excel'}]
    },
    {
        path: '/theme',
        component: Layout,
        redirect: 'noredirect',
        name: 'theme',
        icon: 'theme',
        noDropdown: true,
        children: [{path: 'index', component: Theme, name: '换肤'}]
    },
    {
        path: '/example',
        component: Layout,
        redirect: 'noredirect',
        name: '综合实例',
        icon: 'zonghe',
        children: [
            {
                path: '/table',
                component: TableLayout,
                redirect: '/table/table',
                name: 'table',
                children: [
                    {path: 'dynamictable', component: DynamicTable, name: '动态table'},
                    {path: 'dragtable', component: DragTable, name: '拖拽table'},
                    {path: 'inline_edit_table', component: InlineEditTable, name: 'table内编辑'},
                    {path: 'table', component: Table, name: '综合table'}
                ]
            },
            {path: 'form1', component: Form1, name: '综合form1'}
        ]
    },
    {path: '*', redirect: '/404', hidden: true}
];
