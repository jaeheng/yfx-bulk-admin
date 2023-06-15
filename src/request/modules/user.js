import request from '@/request'

export const getUserInfo = (params) => {
    return request.get('/user/info', {
        params
    })
}

export const editUserInfo = (data) => {
    return request.post('/user/edit', data)
}

export const getFieldList = (id) => {
    return request.get('/project/field', {
        params: {id}
    })
}

export const getProjectInfo = id => {
    return request.get('/project/info', {
        params: {id}
    })
}
/**
 * 获取已经软删除的项目列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getDeletedUser = params => {
    return request.get('/project/deleted', {
        params: params
    })
}

/**
 * 恢复账号
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const recoverUser = id => {
    return request.post('/project/recover', {id})
}

/**
 * 彻底删除用户
 * @param id
 * @returns {Promise<AxiosResponse<any>>}
 */
export const confirmDeleteUser = id => {
    return request.post('/project/confirmDelete', {id})
}
