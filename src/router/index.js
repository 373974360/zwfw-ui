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

/************************基础信息管理************************/
/* index */
const BaseSystem = () => import('../views/baseSystem/index');
/* 组织机构 */
const Dept = () => import('../views/baseSystem/org/dept');
const User = () => import('../views/baseSystem/org/user');
const Menu = () => import('../views/baseSystem/org/menu');
const Role = () => import('../views/baseSystem/org/role');
const Dict = () => import('../views/baseSystem/data/dic');
/* 系统管理 */
const Cache = () => import('../views/baseSystem/setting/cache');
const Log = () => import('../views/baseSystem/setting/log');

/************************应用组件管理************************/
/* index */
const AppSystem = () => import('../views/appSystem/index');
/* 友情链接 */
const LinkType = () => import('../views/appSystem/link/jobLinkType');
const Link = () => import('../views/appSystem/link/jobLink');
/* 广告管理 */
const AdType = () => import('../views/appSystem/ad/jobAdType');
const Ad = () => import('../views/appSystem/ad/jobAd');
/* 分信息管理 */
const Hyfl = () => import('../views/appSystem/flxx/hyfl');
const Znfl = () => import('../views/appSystem/flxx/znfl');
const Zyfl = () => import('../views/appSystem/flxx/zyfl');




/************************招聘信息管理************************/
/* index */
const JobSystem = () => import('../views/jobSystem/index');

/* 会员管理 */
const MemberPersonal = () => import('../views/jobSystem/member/personal');
const MemberOrgan = () => import('../views/jobSystem/member/organ');
const MemberLevel = () => import('../views/jobSystem/member/jobMemberLevel');
/* 招聘信息 */
const Zpxx = () => import('../views/jobSystem/zpxx/zpxx');


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
        name: '基础信息管理',
        meta: {permission: 'baseSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: BaseSystem}]
    },
    {
        path: '/appSystem',
        component: Layout,
        name: '应用组件管理',
        meta: {permission: 'appSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: AppSystem}]
    },
    {
        path: '/jobSystem',
        component: Layout,
        name: '招聘信息管理',
        meta: {permission: 'jobSystem:admin'},
        hidden: true,
        children: [{path: 'index', component: JobSystem}]
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
                path: 'dict',
                component: Dict,
                name: '数据字典',
                meta: {permission: 'baseSystem:data:dicIndex:list'}
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
    /**************************应用组件管理*****************************/
    {
        path: '/link',
        redirect: 'noredirect',
        name: '友情链接',
        meta: {permission: 'appSystem:link:admin'},
        icon: 'lianjie',
        component: Layout,
        children: [
            {
                path: 'linktype',
                component: LinkType,
                name: '链接类型',
                meta: {permission: 'appSystem:link:linktype:list'}
            },
            {
                path: 'link',
                component: Link,
                name: '链接管理',
                meta: {permission: 'appSystem:link:link:list'}
            }
        ]
    },
    {
        path: '/ad',
        redirect: 'noredirect',
        name: '广告管理',
        meta: {permission: 'appSystem:ad:admin'},
        icon: 'msnui-ad',
        component: Layout,
        children: [
            {
                path: 'adtype',
                component: AdType,
                name: '广告位类型',
                meta: {permission: 'appSystem:ad:adtype:list'}
            },
            {
                path: 'ad',
                component: Ad,
                name: '广告内容管理',
                meta: {permission: 'appSystem:ad:ad:list'}
            }
        ]
    },
    {
        path: '/flxx',
        redirect: 'noredirect',
        name: '分类信息',
        meta: {permission: 'appSystem:flxx:admin'},
        icon: 'fenlei',
        component: Layout,
        children: [
            {
                path: 'znfl',
                component: Znfl,
                name: '职能分类',
                meta: {permission: 'appSystem:flxx:znfl:list'}
            },
            {
                path: 'zyfl',
                component: Zyfl,
                name: '专业分类',
                meta: {permission: 'appSystem:flxx:zyfl:list'}
            },
            {
                path: 'hyfl',
                component: Hyfl,
                name: '行业分类',
                meta: {permission: 'appSystem:flxx:hyfl:list'}
            }
        ]
    },
    /**************************招聘信息管理*****************************/
    {
        path: '/member',
        redirect: 'noredirect',
        name: '会员管理',
        meta: {permission: 'jobSystem:member:admin'},
        icon: 'zuzhi',
        component: Layout,
        children: [
            {
                path: 'personal',
                component: MemberPersonal,
                name: '个人会员',
                meta: {permission: 'jobSystem:member:personal:list'}
            },
            {
                path: 'organ',
                component: MemberOrgan,
                name: '企业会员',
                meta: {permission: 'jobSystem:member:organ:list'}
            },
            {
                path: 'memberLevel',
                component: MemberLevel,
                name: '会员级别',
                meta: {permission: 'jobSystem:member:level:list'}
            }
        ]
    },
    {
        path: '/zpxx',
        redirect: 'noredirect',
        name: '招聘信息',
        meta: {permission: 'jobSystem:zpxx:admin'},
        icon: 'neirongguanli',
        component: Layout,
        children: [
            {
                path: 'zpxx',
                component: Zpxx,
                name: '招聘信息',
                meta: {permission: 'jobSystem:zpxx:zpxx:list'}
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
