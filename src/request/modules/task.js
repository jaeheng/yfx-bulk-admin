import request from '@/request'
export const failTaskList = (params) => {
    return request.get('/task/failTaskList', {
        params
    })
}
