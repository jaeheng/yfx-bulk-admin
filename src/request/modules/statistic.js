import request from '@/request'
export const indexTask = (params) => {
    return request.get('/index/task', {
        params
    })
}

export const indexSample = (year) => {
    return request.get('/index/sample', {
        params: { year }
    })
}
