import request from '@/request'

/**
 * 获取客户管理员项目列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getManageList = (params) => {
    return request.get('/manage/list', {
        params
    })
}
/**
 * 创建客户管理员项目
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createManage = (params) => {
    return request.post('/manage/create', params)
}
/**
 * 更新客户管理员项目
 * @param params
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateManage = (params, id) => {
    return request.post(`/manage/${id}/update`, params)
}
