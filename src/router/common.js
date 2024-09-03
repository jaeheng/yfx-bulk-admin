/**
 * 普通页面，没有后台布局，如首页
 */
export default [
    {
        path: '/',
        name: 'home',
        component: () => import(/* webpackChunkName: "common/home" */ '_v/common/home.vue'),
        meta: {
            title: '首页',
            public: true
        }
    },
    {
        path: '/404',
        name: 'PageNotExist',
        component: () => import('_v/common/404.vue')
    }
]
