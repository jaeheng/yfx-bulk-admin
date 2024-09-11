import request from '@/request'

/**
 * 获取日志列表
 * @param params
 * @returns {Promise<AxiosResponse<any>>}
 */
export const getLogList = (params) => {
    return request.get('/log', {
        params
    })
}
