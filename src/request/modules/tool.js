import request from '@/request'
export const toolList = (params) => {
    return request.get('/tool', {
        params
    })
}
