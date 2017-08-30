import Vue from 'vue';
import Router from 'vue-router';

/* layout */
import Layout from '../views/layout/Layout';

/* login */
import Login from '../views/login/';
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
const Dict = () => import('../views/sys/system/dict');
const MetadataType = () => import('../views/sys/system/metadataType');
const SysMessageFiled = () => import('../views/sys/system/sysMessageFiled');
const SysMessageTemplate = () => import('../views/sys/system/SysMessageTemplate');


/* zwfw */
const Category = () => import('../views/zwfw/category');
const Item = () => import('../views/zwfw/zwfwItem');
const Window = () => import('../views/zwfw/window');
const FormEditor = () => import('../views/zwfw/formEditor/editor');
const LegalPerson = () => import('../views/zwfw/zwfwLegalPerson');
const NaturePerson = () => import('../views/zwfw/zwfwNaturePerson');
const ZwfwProcessDefinitionModel = () => import('../views/zwfw/activiti/zwfwProcessDefinitionModel');
const ZwfwProcessDefinition = () => import('../views/zwfw/activiti/ZwfwProcessDefinition');
const ZwfwTaskSetting = () => import('../views/zwfw/activiti/ZwfwTaskSetting')

/* 定时任务 */
const RegistryCenter = () => import('../views/task/registryCenter');
const Task = () => import('../views/task/task');

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

/* Member */
const MemberPersonal = () => import('../views/job/member/personal');
const MemberOrgan = () => import('../views/job/member/organ');
const Zpxx = () => import('../views/job/member/zpxx');
const MemberLevel = () => import('../views/job/member/jobMemberLevel');


/* 广告位管理 */
const JobAd = () => import('../views/job/ad/jobAd');
const JobAdType = () => import('../views/job/ad/jobAdType');

/* 友情链接 */
const JobLink = () => import('../views/job/link/jobLink');
const JobLinkType = () => import('../views/job/link/jobLinkType');

/* 内容管理 */
const JobInfo = () => import('../views/job/info/jobInfo');
const JobInfoCatalog = () => import('../views/job/info/jobInfoCatalog');

/* 分类信息 */
const Zyfl = () => import('../views/job/flxx/zyfl');
const Hyfl = () => import('../views/job/flxx/hyfl');
const Znfl = () => import('../views/job/flxx/znfl');

/* 统计分析 */
const OrganData = () => import('../views/job/statistics/organdata');
const PersonalData = () => import('../views/job/statistics/personaldata');

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
        path: '/member',
        component: Layout,
        redirect: 'noredirect',
        name: '会员管理',
        icon: 'huiyuan',
        children: [
            {path: 'personal', component: MemberPersonal, name: '个人会员'},
            {path: 'organ', component: MemberOrgan, name: '企业会员'},
            {path: 'zpxx', component: Zpxx, name: '招聘信息'},
            {path: 'memberLevel', component: MemberLevel, name: '会员级别'}
        ]
    },
    {
        path: '/info',
        component: Layout,
        redirect: 'noredirect',
        name: '内容管理',
        icon: 'neirongguanli',
        children: [
            {path: 'jobInfo', component: JobInfo, name: '内容管理'},
            {path: 'jobInfoCatalog', component: JobInfoCatalog, name: '目录管理'}
        ]
    },
    {
        path: '/ad',
        component: Layout,
        redirect: 'noredirect',
        name: '广告管理',
        icon: 'msnui-ad',
        children: [
            {path: 'jobad', component: JobAd, name: '广告内容'},
            {path: 'jobadtype', component: JobAdType, name: '广告位'}
        ]
    },
    {
        path: '/link',
        component: Layout,
        redirect: 'noredirect',
        name: '友情链接',
        icon: 'lianjie',
        children: [
            {path: 'joblink', component: JobLink, name: '友情链接'},
            {path: 'joblinktype', component: JobLinkType, name: '链接分类'}
        ]
    },
    {
        path: '/flxx',
        component: Layout,
        redirect: 'noredirect',
        name: '分类设置',
        icon: 'fenlei',
        children: [
            {path: 'zyfl', component: Zyfl, name: '专业分类'},
            {path: 'hyfl', component: Hyfl, name: '行业分类'},
            {path: 'znfl', component: Znfl, name: '职能分类'}
        ]
    },
    {
        path: '/statistics',
        component: Layout,
        redirect: 'noredirect',
        name: '统计分析',
        icon: 'statisticalAnalysis',
        children: [
            {path: 'organdata', component: OrganData, name: '企业数据统计'},
            {path: 'personaldata', component: PersonalData, name: '个人数据统计'}
        ]
    },
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
        path: '/system',
        component: Layout,
        redirect: 'noredirect',
        name: '系统管理',
        icon: 'system',
        children: [
            {path: 'metadataType', component: MetadataType, name: '元数据类型'},
            {path: 'dict', component: Dict, name: '数据字典'},
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
            {path: 'window', component: Window, name: '窗口管理'},
            {path: 'zwfwLegalPerson', component: LegalPerson, name: '法人管理'},
            {path: 'zwfwNaturePerson', component: NaturePerson, name: '自然人管理'},
            {path: 'zwfwProcessDefinitionModel', component: ZwfwProcessDefinitionModel, name: '流程模型编辑'},
            {path: 'zwfwProcessDefinition', component: ZwfwProcessDefinition, name: '已部署流程管理'},
            {path: 'zwfwUserTaskSetting', component: ZwfwTaskSetting, name: '审批节点管理'},
            // {path: 'zwfwProcessInstance', component: ZwfwProcessDefinitionModel, name: '已部署流程管理'},

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
