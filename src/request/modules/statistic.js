import request from '@/request'

export const indexStatistic = () => {
    return request.get('/index', {
        params: {}
    })
}

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
