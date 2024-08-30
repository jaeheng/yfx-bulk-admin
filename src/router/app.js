/**
 * 后台布局页面
 */
export default {
    path: '/',
    component: () => import('_v/layout.vue'),
    children: [
        {
            path: '/dashboard',
            name: 'dashboard',
            component: () => import('_v/dashboard/index.vue'),
            meta: {
                title: '首页'
            }
        },
        {
            path: '/company',
            name: 'company',
            component: () => import('_v/company/index.vue'),
            meta: {
                title: '公司管理'
            }
        },
        {
            path: '/projects',
            name: 'projects',
            component: () => import('_v/projects/list.vue'),
            meta: {
                title: '项目列表'
            }
        },
        {
            path: '/projects/create',
            name: 'projectsCreate',
            component: () => import('_v/projects/create.vue'),
            meta: {
                title: '创建项目',
                bread: [
                    {
                        name: 'projects',
                        title: '项目列表'
                    }
                ]
            }
        },
        {
            path: '/projects/edit/:id',
            name: 'projectsEdit',
            component: () => import('_v/projects/edit.vue'),
            meta: {
                title: '编辑项目',
                bread: [
                    {
                        name: 'projects',
                        title: '项目列表'
                    }
                ]
            }
        },
        {
            path: '/projects/field/:id',
            name: 'projectsField',
            component: () => import('_v/projects/field.vue'),
            meta: {
                title: '属性表字段',
                bread: [
                    {
                        name: 'projects',
                        title: '项目列表'
                    }
                ]
            }
        },
        {
            path: '/projects/import/:id',
            name: 'projectsImport',
            component: () => import('_v/projects/import.vue'),
            meta: {
                title: '导入项目数据',
                bread: [
                    {
                        name: 'projects',
                        title: '项目列表'
                    }
                ]
            }
        },
        {
            path: '/task',
            name: 'task',
            component: () => import('_v/task/index.vue'),
            redirect: '/task/list',
            meta: {
                title: '任务列表'
            },
            children: [
                {
                    path: 'list',
                    name: 'taskList',
                    component: () => import('_v/task/list.vue'),
                    meta: {
                        title: '任务列表'
                    }
                },
                {
                    path: 'queue',
                    name: 'taskQueue',
                    component: () => import('_v/task/queue.vue'),
                    meta: {
                        title: '任务队列'
                    }
                },
                {
                    path: 'queue-failed',
                    name: 'taskQueueFailed',
                    component: () => import('_v/task/queueFailed.vue'),
                    meta: {
                        title: '失败队列'
                    }
                }
            ]
        },
        {
            path: '/system',
            name: 'system',
            component: () => import('_v/system/index.vue'),
            redirect: '/system/ucenter',
            meta: {
                title: '系统管理'
            },
            children: [
                {
                    path: '/system/ucenter',
                    name: 'ucenter',
                    component: () => import('_v/system/ucenter/edit.vue'),
                    meta: {
                        title: '个人信息'
                    }
                },
                {
                    path: '/system/password',
                    name: 'systemPassword',
                    component: () => import('_v/system/ucenter/password.vue'),
                    meta: {
                        title: '修改密码'
                    }
                },
                {
                    path: '/system/species',
                    name: 'species',
                    component: () => import('_v/system/species/index.vue'),
                    meta: {
                        title: '物种管理'
                    }
                },
                {
                    path: '/system/color-sets',
                    name: 'colorSets',
                    component: () => import('_v/system/colorsets/index.vue'),
                    meta: {
                        title: '颜色集管理'
                    }
                }
            ]
        },
        {
            path: '/sets',
            name: 'sets',
            component: () => import('_v/sets/index.vue'),
            redirect: '/sets/public-gene-set',
            meta: {
                title: '集合配置'
            },
            children: [
                {
                    path: '/sets/public-gene-set',
                    name: 'publicGeneSet',
                    component: () => import('_v/sets/geneSetCategory/index.vue'),
                    meta: {
                        title: '公共基因集配置'
                    }
                }
            ]
        },
        {
            path: '/tool',
            name: 'tool',
            component: () => import('_v/tool/index.vue'),
            meta: {
                title: '工具管理'
            }
        },
        {
            path: '/tool/edit',
            name: 'toolEditSc',
            component: () => import('_v/tool/edit.vue'),
            meta: {
                title: '工具信息编辑',
                bread: [
                    {
                        name: 'toolSc',
                        title: '单细胞工具'
                    }
                ]
            }
        },
        {
            path: '/statistic',
            name: 'statistic',
            component: () => import('_v/statistic/index.vue'),
            redirect: '/statistic/task',
            meta: {
                title: '统计中心'
            },
            children: [
                {
                    path: '/statistic/task',
                    name: 'statisticTask',
                    component: () => import('_v/statistic/task.vue'),
                    meta: {
                        title: '任务数据统计'
                    }
                },
                {
                    path: '/statistic/sample',
                    name: 'statisticSample',
                    component: () => import('_v/statistic/sample.vue'),
                    meta: {
                        title: '样本数据统计'
                    }
                }
            ]
        }
    ]
}
