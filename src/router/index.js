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
const Dept = () => import('../views/org/dept');
const User = () => import('../views/org/user');
const Menu = () => import('../views/org/menu');
const Role = () => import('../views/org/role');

/* system */
const Holiday = () => import('../views/system/holiday');
const Log = () => import('../views/system/log');

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
        path: '/system',
        component: Layout,
        redirect: 'noredirect',
        name: '系统管理',
        icon: 'system',
        children: [
            {path: 'date', component: Holiday, name: '节假日管理'},
            {path: 'log', component: Log, name: '日志管理'}
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
