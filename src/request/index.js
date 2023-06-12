import axios from 'axios'
import { ElMessage } from 'element-plus'
import store from '_s'
import Nprogress from 'nprogress'
import { BASE_URL } from '@/config/app'
import _ from 'lodash'
import {getToken} from "@/libs/storage";

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: 100000,
  withCredentials: true,
  headers: {
    'X-Custom-Header': 'From Zero Code Admin'
  }
})

instance.interceptors.request.use(function (config) {
  Nprogress.start()
  config.headers['Authorization'] = getToken()
  return config
})
instance.interceptors.response.use(function (response) {
  const data = response.data.content
  const code = response.data.code
  const message = response.data.message
  Nprogress.done()
  // 请求返回正常数据
  if (code === 200) {
    return data
  } else if (code === 401) {
    setTimeout(() => {
      // store.dispatch('user/clearUserInfo').then(r => {})
      const temp = window.location.hash.split('redirect=')
      let redirect = ''
      if (temp.length > 1) {
        redirect = _.last(temp)
      } else {
        redirect = window.location.hash.substring(1)
      }
      window.location.href = '/#/?redirect=' + redirect
    }, 300)
  } else if (code === 402) {
    window.location.href = '/#/forbidden'
  } else {
    ElMessage.error(message)
    return Promise.reject(message)
  }
}, function (error) {
  console.error(error)
  Nprogress.done()
  return Promise.reject(error)
})

export default instance
