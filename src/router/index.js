import { createRouter, createWebHashHistory } from 'vue-router'
import common from './common'
import app, { MainMenus } from './app'
import Nprogress from 'nprogress'
import { SITE_NAME } from '@/config/app'
import { getToken } from '@/libs/storage'

const route = createRouter({
    history: createWebHashHistory(),
    routes: [
        ...common,
        ...MainMenus,
        app,
        {
            path: '/:catchAll(.*)',
            redirect: '/404'
        }
    ]
})
/**
 * 路由前置操作
 */
route.beforeEach((to, from, next) => {
    Nprogress.start()
    document.title = to.meta.title ? to.meta.title + ' - ' + SITE_NAME : SITE_NAME
    const token = getToken()
    if (!token && to.name === 'home') {
        next()
    } else if (!token && to.name !== 'home') {
        next('/')
        Nprogress.done()
    } else if (token && to.name === 'home') {
        next('/dashboard')
        Nprogress.done()
    } else {
        next()
    }
})

/**
 * 路由后置操作
 */
route.afterEach((to, from) => {
    Nprogress.done()
})

export default route
