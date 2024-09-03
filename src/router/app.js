/**
 * 后台布局页面
 */
export const MainMenus = [
    {
        path: '/dashboard',
        name: 'dashboardIndex',
        component: () => import('_v/dashboard/index.vue'),
        meta: {
            title: '控制台',
            icon: 'icon-home'
        }
    },
    {
        path: '/company',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '公司管理',
            icon: 'icon-company'
        },
        children: [
            {
                path: '/company',
                name: 'company',
                component: () => import('_v/company/index.vue'),
                meta: {
                    title: '公司列表'
                }
            }
        ]
    },
    {
        path: '/projects',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '项目管理',
            icon: 'icon-file'
        },
        children: [
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
            }
        ]
    },
    {
        path: '/task',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '任务管理',
            icon: 'icon-task'
        },
        children: [
            {
                path: '/task',
                name: 'taskList',
                component: () => import('_v/task/list.vue'),
                meta: {
                    title: '任务列表'
                }
            },
            {
                path: '/task/queue',
                name: 'taskQueue',
                component: () => import('_v/task/queue.vue'),
                meta: {
                    title: '任务队列'
                }
            },
            {
                path: '/task/queue-failed',
                name: 'taskQueueFailed',
                component: () => import('_v/task/queueFailed.vue'),
                meta: {
                    title: '失败队列'
                }
            }
        ]
    },
    {
        path: '/tool',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '工具管理',
            icon: 'icon-tools'
        },
        children: [
            {
                path: '/tool',
                name: 'tool',
                component: () => import('_v/tool/index.vue'),
                meta: {
                    title: '工具列表'
                }
            }
        ]
    },
    {
        path: '/system',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '系统管理',
            icon: 'icon-setting2'
        },
        children: [
            {
                path: '/system',
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
        component: () => import('_v/layout.vue'),
        meta: {
            title: '集合配置',
            icon: 'icon-modular'
        },
        children: [
            {
                path: '/sets/public',
                name: 'publicGeneSet',
                component: () => import('_v/sets/geneSetCategory/index.vue'),
                meta: {
                    title: '公共基因集配置'
                }
            }
        ]
    },
    {
        path: '/statistic',
        component: () => import('_v/layout.vue'),
        meta: {
            title: '统计中心',
            icon: 'icon-data-view'
        },
        children: [
            {
                path: '/statistic',
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
            },
            {
                path: '/statistic/storage',
                name: 'statisticStorage',
                component: () => import('_v/statistic/storage.vue'),
                meta: {
                    title: '数据大小统计'
                }
            }
        ]
    }
]

export default {
    path: '/',
    component: () => import('_v/layout.vue'),
    children: [
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
        }
    ]
}
