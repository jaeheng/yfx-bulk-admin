export const PAGE_LAYOUT = 'total, prev, pager, next, jumper'
export const PAGE_SIZE = 15
export const DATA_TYPE = {
    cell: 0,
    gene: 1,
    stCell: 2,
    stGene: 3
}
/**
 * app配置文件
 */
export default {
    dataType: DATA_TYPE,
    pageSize: PAGE_SIZE,
    pageLayout: PAGE_LAYOUT
}

// 本地存储key前缀
export const STORAGE_SUFFIX = 'yfx_bulk_admin'
// 系统名称
export const SITE_NAME = import.meta.env.VUE_APP_NAME
// 版本
export const APP_VERSION = __APP_VERSION__
// cookie过期时间, 天
export const COOKIE_EXPIRES = 2

// 接口的base_url
export const BASE_URL = '/api'

// 任务状态
export const TASK_STATE = {
    '-1': {
        text: '未开始',
        type: 'info'
    },
    0: {
        text: '进行中',
        type: 'warning'
    },
    1: {
        text: '成功',
        type: 'success'
    },
    2: {
        text: '失败',
        type: 'danger'
    },
    3: {
        text: '写入中',
        type: 'warning'
    }
}

// 注释库默认的维护者
export const DEFAULT_MAINTAINER = 'lc@eanalyse.cn'
// 注释库目录前缀
// {前缀}/{物种名称}/{注释库名称}
export const ANNOTATION_PREFIX = '/home/yfx/YFX/anno_database/'
// 物种注释库包含的内容
export const ANNOTATION_REQUIRES = ['GO', 'KEGG', 'PPI', 'TF', 'inferCNV', 'Reactome', 'MsigDB', 'Disease']
// 单细胞数据标志
export const SINGLE_CELL_DATA = 'sc'
// 空间数据标志
export const SPATIAL_DATA = 'st'

export const MATRIX_TYPE = {
    counts: 'counts',
    normalized: 'normalized'
}

export const COLOR_PRESETS = [
    {
        "class": "processing",
        "color": "#1677ff",
        "background-color": "#e6f4ff"
    },
    {
        "class": "success",
        "color": "#52c41a",
        "background-color": "#f6ffed"
    },
    {
        "class": "error",
        "color": "#ff4d4f",
        "background-color": "#fff2f0"
    },
    {
        "class": "warning",
        "color": "#faad14",
        "background-color": "#fffbe6"
    },
    {
        "class": "magenta",
        "color": "#c41d7f",
        "background-color": "#fff0f6"
    },
    {
        "class": "red",
        "color": "#cf1322",
        "background-color": "#fff1f0"
    },
    {
        "class": "volcano",
        "color": "#d4380d",
        "background-color": "#fff2e8"
    },
    {
        "class": "orange",
        "color": "#d46b08",
        "background-color": "#fff7e6"
    },
    {
        "class": "gold",
        "color": "#d48806",
        "background-color": "#fffbe6"
    },
    {
        "class": "lime",
        "color": "#7cb305",
        "background-color": "#fcffe6"
    },
    {
        "class": "green",
        "color": "#389e0d",
        "background-color": "#f6ffed"
    },
    {
        "class": "cyan",
        "color": "#08979c",
        "background-color": "#e6fffb"
    },
    {
        "class": "blue",
        "color": "#0958d9",
        "background-color": "#e6f4ff"
    },
    {
        "class": "geekblue",
        "color": "#1d39c4",
        "background-color": "#f0f5ff"
    },
    {
        "class": "purple",
        "color": "#531dab",
        "background-color": "#f9f0ff"
    }
]
