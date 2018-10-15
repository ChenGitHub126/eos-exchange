/* eslint-disable */
import Vue from 'vue';
import Router from 'vue-router';
import Layout from '../views/layout/Layout';

Vue.use(Router);

/**
 * @for meta
 * @param title 标题
 * @param icon 图标
 * @param name 用来匹配路由名称
 */


export const constantRouterMap = [
    {
        path: '/',
        component: Layout,
        redirect: '/',
        meta: { title: 'exchang' },
        children: [
            {
                path: '/',
                name: 'index',
                component: resolve => require(['@/views/index/Index'], resolve),
                meta: { title: 'Newdex - The first global decerntralized exchange base on EOS' },
            }
        ],
    },
    // 交易模块
    {
        path: '/market',
        component: Layout,
        redirect: '/market',
        meta: { title: 'exchang' },
        children: [
            {
                path: '/',
                name: 'market',
                component: resolve => require(['@/views/market/Index'], resolve),
                meta: { title: 'Newdex - Market' },
            },
            {
                path: '/selfAreaSetting',
                name: 'selfAreaSetting',
                component: resolve => require(['@/views/market/childView/SelfAreaSetting'], resolve),
                meta: { title: 'Newdex - SelfAreaSetting' },
            },
            {
                path: '/trade/:symbol',
                name: 'trade',
                component: resolve => require(['@/views/market/childView/Trade'], resolve),
                meta: { title: 'Newdex - Trade' },
            },
            {
                path: '/coinHistoryList/:symbol',
                name: 'coinHistoryList',
                component: resolve => require(['@/views/market/childView/CoinHistoryList'], resolve),
                meta: { title: 'Newdex - CoinHistoryList' },
            },
            {
                path: '/linek/:symbol',
                name: 'linek',
                component: resolve => require(['@/views/market/childView/LineK'], resolve),
                meta: { title: 'Newdex - LineK' },
            },
        ],
    },
    // 订单
    {
        path: '/order',
        component: Layout,
        redirect: '/order',
        meta: { title: 'exchang' },
        children: [
            {
                path: '/',
                name: 'order',
                component: resolve => require(['@/views/order/Index'], resolve),
                meta: { title: 'Newdex - Order' },
            },
            {
                path: '/orderDetail',
                name: 'orderDetail',
                component: resolve => require(['@/views/order/components/OrderDetail'], resolve),
                meta: { title: 'Newdex - OrderDetail' },
            },
        ],
    },
    // 资产
    {
        path: '/property',
        component: Layout,
        redirect: '/property',
        meta: { title: 'exchang' },
        children: [
            {
                path: '/',
                name: 'property',
                component: resolve => require(['@/views/property/Index'], resolve),
                meta: { title: 'Newdex - Property' },
            }
        ],
    },
    // 更多
    {
        path: '/more',
        component: Layout,
        redirect: '/more',
        meta: { title: 'exchang' },
        children: [
            {
                path: '/',
                name: 'more',
                component: resolve => require(['@/views/more/Index'], resolve),
                meta: { title: 'Newdex - More' },
            }
        ],
    },
    // error
    {
        path: '*',
        component: resolve => require(['@/views/error/404.vue'], resolve),
        meta: { title: '404 - Newdex' },
    },
];

const myRouter = new Router({
    base: '/',
    mode: 'history',
    routes: constantRouterMap,
});

myRouter.beforeEach((to, from, next) => {
    if (to.meta.title) {
        document.title = to.meta.title;
    }
    next();
});

myRouter.afterEach(() => {});


export default myRouter;

