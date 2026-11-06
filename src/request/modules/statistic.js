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

const indexStatisticByUser = (type) => request.get(`/index/${type}/user`)

export const indexTaskByUser = () => indexStatisticByUser('task')

export const indexSample = (year) => {
    return request.get('/index/sample', {
        params: { year }
    })
}

export const indexSampleByUser = () => indexStatisticByUser('sample')

export const indexStorage = () => {
    return request.get('/index/storage', {
        params: {}
    })
}

export const indexStorageByUser = () => indexStatisticByUser('storage')
export const indexFieldsPublic = () => {
    return request.get('/index/fieldsPublic', {
        params: {}
    })
}
