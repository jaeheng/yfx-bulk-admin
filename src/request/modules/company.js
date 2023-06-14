import request from '@/request'

export const checkCompanySld = (params) => {
    return request.post('/company/check', params)
}
/**
 * 获取公司列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getCompanyList = (params) => {
    return request.get('/company/list', {
        params
    })
}
/**
 * 创建公司信息
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createProject = (params) => {
    return request.post('/project/create', params)
}
