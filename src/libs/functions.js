import Nprogress from 'nprogress'
import axios from 'axios'
import qs from 'qs'
import { getToken, setToken } from './storage'
import _ from 'lodash-es'
import { ElMessage } from 'element-plus'

/**
 * 获取文件名的后缀
 * @param filename string 文件名(可为路径)
 * @returns string|boolean
 * return false表示filename参数没有后缀
 */
export const getSuffix = (filename) => {
  let index = filename.lastIndexOf('.')
  return index === -1 ? false : filename.substr(index + 1)
}

/**
 * 检查search是否存在于array数组中
 * @param elem 要查找的元素
 * @param arr 目标数组
 * @param i fromIndex
 * @returns {boolean}
 */
export const inArray = (elem, arr, i) => {
  if (!(arr instanceof Array)) {
    return false
  }
  return arr.indexOf(elem, i) > -1
}
/**
 * 发送请求
 * @param type 请求类型: 支持get和post
 * @param url 请求地址
 * @param data 请求参数
 * @param success 成功回调: data, message
 * @param error 失败回调: message
 */
export const http = (type, url, data, success, error) => {
  Nprogress.start()

  let config = {
    method: type,
    url: url,
    withCredentials: true,
    headers: {
      Authorization: getToken()
    }
  }

  if (type === 'post' || type === 'put' || type === 'delete') {
    config.data = qs.stringify(data)
  } else if (type === 'get') {
    config.params = data
  }
  axios(config)
    .then((response) => {
      let data = response.data.content
      let code = response.data.code
      let message = response.data.message
      // 请求返回正常数据
      if (code === 200) {
        typeof success === 'function' && success(data, message)
      } else if (code === 401) {
        setToken('')
        setTimeout(() => {
          // window.location.href = '/#/'
          window.location.href = '/#/?redirect=' + window.location.hash.substring(1)
        }, 300)
      } else if (code === 402) {
        window.location.href = '/#/forbidden'
      } else {
        ElMessage.error(message)
        typeof error === 'function' && error(message)
      }
      Nprogress.done()
    })
    .catch(function (err) {
      ElMessage.error(err.message)
      typeof error === 'function' && error(err.message)
      Nprogress.done()
    })
}

/**
 * 发送get请求
 * @param url
 * @param params
 * @param success
 * @param error
 */
export const get = (url, params, success, error) => {
  http('get', url, params, success, error)
}

/**
 * 发送post请求
 * @param url
 * @param params
 * @param success
 * @param error
 */
export const post = (url, params, success, error) => {
  http('post', url, params, success, error)
}

/**
 * 检查是否是十六进制的颜色值
 * @param tester
 * @returns {*|boolean}
 */
export const checkHex = (tester) => {
  return (
    _.isString(tester) && (tester.match(/^#[0-9a-fA-F]{6}$/) || tester.match(/^#[0-9a-fA-F]{3}$/))
  )
}

/**
 * 将时间戳格式化为日期
 * @param second
 * @returns {`${number}/${number}/${number}`}
 */
export const dateFmt = (second) => {
  const date = new Date(second * 1000)
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  return `${year}/${month}/${day}`
}
