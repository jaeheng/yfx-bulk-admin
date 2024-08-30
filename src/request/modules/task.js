import request from '@/request'

export const failTaskList = (params) => {
    return request.get('/task/failTaskList', {
        params
    })
}

export const retryTask = (id) => {
    return request.post('/task/retry', {
        id
    })
}

export const taskList = (params) => {
    return request.get('/task', {
        params
    })
}
export const taskQueue = (params) => {
    return request.get('/task/queue', {
        params
    })
}
export const taskQueueFailed = (params) => {
    return request.get('/task/queue-failed', {
        params
    })
}
export const taskState = (id) => {
    return request.get('/task/state', {
        params: {
            id
        }
    })
}
