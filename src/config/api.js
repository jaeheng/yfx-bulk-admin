import { BASE_URL } from '@/config/app'

export default {
    sign: BASE_URL + '/sign',
    userInfo: BASE_URL + '/user/info',
    password: BASE_URL + '/user/password',
    logout: BASE_URL + '/user/logout',
    index: BASE_URL + '/index',
    project: BASE_URL + '/project',
    task: BASE_URL + '/task',
    projectCreate: BASE_URL + '/project/create',
    projectResetPassword: BASE_URL + '/project/reset/password',
    projectImport: BASE_URL + '/project/import',
    projectInfo: BASE_URL + '/project/info',
    projectEdit: BASE_URL + '/project/edit',
    projectEmail: BASE_URL + '/project/email',
    trial: BASE_URL + '/trial',
    trialSave: BASE_URL + '/trial/save',
    version: BASE_URL + '/version',
    versionCreate: BASE_URL + '/version/create',
    versionUpdate: BASE_URL + '/version/update',
    versionDelete: BASE_URL + '/version/delete',
    versionChange: BASE_URL + '/version/change',
    // 定型默认基因集
    geneset: BASE_URL + '/geneset', // 基因集列表
    genesetTag: BASE_URL + '/geneset/tag', // 基因集标签
    genesetGene: BASE_URL + '/geneset/gene', // 基因集下的基因2
    genesetTable: BASE_URL + '/geneset/table', // 基因集下的基因1
    createNewTag: BASE_URL + '/geneset/tag/add', // 创建一个新的标签
    genesetDelete: BASE_URL + '/geneset/delete', // 删除基因集
    genesetCreate: BASE_URL + '/geneset/create', // 创建基因集
    genesetUpdate: BASE_URL + '/geneset/update', // 更新基因集
    genesetGeneDelete: BASE_URL + '/geneset/gene/delete', // 删除基因集下的基因
    genesetImport: BASE_URL + '/geneset/import', // 批量选择基因
    // 公司
    companyList: BASE_URL + '/company/list',
    companyCreate: BASE_URL + '/company/create',
    companyEdit: BASE_URL + '/company/edit',
    companyUpload: BASE_URL + '/company/upload',
    // 首页工具统计
    indexTool: BASE_URL + '/index/tool',
    // 颜色集
    colorSetList: BASE_URL + '/colorset',
    deleteColorSet: BASE_URL + '/colorset/delete',
    addColorSet: BASE_URL + '/colorset/create',
    editColorSet: BASE_URL + '/colorset/update',
    // 工具
    tool: BASE_URL + '/tools',
    toolInfo: BASE_URL + '/tools/info',
    toolEdit: BASE_URL + '/tools/edit',
    toolIconUpload: BASE_URL + '/tools/upload',
    toolSortChange: BASE_URL + '/tools/sort'
}
