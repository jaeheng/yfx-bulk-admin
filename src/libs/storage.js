import { COOKIE_EXPIRES, STORAGE_SUFFIX } from '@/config/app'
import Cookies from 'js-cookie'

/**
 * 设置本地存储
 * @param key string 本地存储的key
 * @param value string 要存储的值
 */
export const setLocalStorage = (key, value) => {
  if (typeof key === 'string' && key !== '') {
    localStorage.setItem(STORAGE_SUFFIX + key, String(value))
  }
}
/**
 * 获取本地存储
 * @param key
 * @returns string/boolean 要获取的值
 */
export const getLocalStorage = (key) => {
  if (typeof key === 'string' && key !== '') {
    return localStorage.getItem(STORAGE_SUFFIX + key) || false
  }
  return false
}

/**
 * 设置token
 * @param token
 * @param expires
 */
export const setToken = (token, expires) => {
  Cookies.set(STORAGE_SUFFIX + '_token', token, { expires: expires || COOKIE_EXPIRES || 1 })
}

/**
 * 从本地获取token
 * @returns {boolean|*}
 */
export const getToken = () => {
  return Cookies.get(STORAGE_SUFFIX + '_token')
}
