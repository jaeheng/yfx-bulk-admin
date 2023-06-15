import request from '@/request'

/**
 * 获取物种列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getSpeciesList = (params) => {
    return request.get('/species/list', {
        params
    })
}

/**
 * 创建物种信息
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createSpecies = data => {
    return request.post('/species/create', data)
}
/**
 * 更新物种信息
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateSpecies = data => {
    return request.post('/species/update', data)
}
/**
 * 删除物种信息
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const deleteSpecies = id => {
    return request.post('/species/delete', {
        id
    })
}

/**
 * 获取注释库列表
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getAnnotationList = () => {
    return request.get('/library/list')
}

/**
 * 创建注释库
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const createAnnotation = data => {
    return request.post('/library/create', data)
}

/**
 * 更新注释库
 * @param data
 * @returns {Promise<AxiosResponse<any>>}
 */
export const updateAnnotation = data => {
    return request.post('/library/update', data)
}
