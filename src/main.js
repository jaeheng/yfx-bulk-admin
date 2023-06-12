import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import ElementPlus from 'element-plus'
import util from './libs/util'
import api from './config/api'
import './assets/style/element.scss'
import './assets/style/app.scss'
import appConfig from './config/app'
import store from './store'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

/* eslint-disable no-new */
const app = createApp(App)
app.use(router)
app.use(store)
app.use(ElementPlus, { size: 'large', locale: zhCn })
app.config.globalProperties.$util = util
app.config.globalProperties.api = api
app.config.globalProperties.$appConfig = appConfig

app.mount('#app')
