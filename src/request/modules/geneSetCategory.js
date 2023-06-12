import request from '@/request'
import { BASE_URL } from '@/config/app'

export const geneSetCategoryDelete = (params) => {
  return request.post('/geneset/category/delete', params)
}
export const geneSetCategoryCreate = (params) => {
  return request.post('/geneset/category/create', params)
}
export const geneSetCategoryEdit = (params) => {
  return request.post('/geneset/category/edit', params)
}
/**
 * 公共基因集列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const genesetsPublic = (params) => {
  return request.get('/geneset/category/genesets', {
    params
  })
}
/**
 * 上传文件更新公共基因集
 * @type {string}
 */
export const GENESET_PUBLIC_UPLOAD = BASE_URL + '/geneset/category/upload'
