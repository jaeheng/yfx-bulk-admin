import request from '@/request'

export const geneSetList = (params) => {
    return request.get('/geneset', {
        params
    })
}
