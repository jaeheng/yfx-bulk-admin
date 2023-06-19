import request from '@/request'

export const getToolList = () => {
    return request.get('/tools', {})
}
