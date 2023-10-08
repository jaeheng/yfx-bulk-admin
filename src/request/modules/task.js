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
