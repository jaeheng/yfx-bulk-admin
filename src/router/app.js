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
      path: '/accounts',
      name: 'accounts',
      component: () => import('_v/accounts/index.vue'),
      redirect: '/accounts/list',
      children: [
        {
          path: '/accounts/list',
          name: 'accountsList',
          component: () => import('_v/accounts/list.vue'),
          meta: {
            title: '账号列表'
          }
        },
        {
          path: '/accounts/manages',
          name: 'manages',
          component: () => import('_v/manages/index.vue'),
          meta: {
            title: '客户后台账号管理'
          }
        },
        {
          path: '/accounts/company',
          name: 'company',
          component: () => import('_v/accounts/company/index.vue'),
          meta: {
            title: '公司管理'
          }
        },
        {
          path: '/accounts/pass',
          name: 'pass',
          component: () => import('_v/accounts/pass/index.vue'),
          meta: {
            title: '试用账号申请',
            bread: []
          }
        },
        {
          path: '/accounts/create',
          name: 'accountsCreate',
          component: () => import('_v/accounts/create.vue'),
          meta: {
            title: '创建账号',
            bread: [
              {
                name: 'accounts',
                title: '账号列表'
              }
            ]
          }
        },
        {
          path: '/accounts/edit/:id',
          name: 'accountsEdit',
          component: () => import('_v/accounts/edit.vue'),
          meta: {
            title: '编辑账号',
            bread: [
              {
                name: 'accounts',
                title: '账号列表'
              }
            ]
          }
        },
        {
          path: '/accounts/field/:id',
          name: 'accountsField',
          component: () => import('_v/accounts/field.vue'),
          meta: {
            title: '属性表字段',
            bread: [
              {
                name: 'accounts',
                title: '账号列表'
              }
            ]
          }
        },
        {
          path: '/accounts/deleted',
          name: 'accountsDeleted',
          component: () => import('_v/accounts/deleted.vue'),
          meta: {
            title: '已删除账号',
            bread: [
              {
                name: 'accounts',
                title: '账号列表'
              }
            ]
          }
        }
      ]
    },
    {
      path: '/task',
      name: 'task',
      component: () => import('_v/task/index.vue'),
      meta: {
        title: '任务列表'
      }
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
          path: '/system/upgrade',
          name: 'upgrade',
          component: () => import('_v/system/upgrade/index.vue'),
          meta: {
            title: '更新记录',
            bread: []
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
      redirect: '/tool/sc',
      meta: {
        title: '工具管理'
      },
      children: [
        {
          path: '/tool/edit/sc',
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
          path: '/tool/edit/st',
          name: 'toolEditSt',
          component: () => import('_v/tool/edit.vue'),
          meta: {
            title: '工具信息编辑',
            bread: [
              {
                name: 'toolSt',
                title: '空间工具'
              }
            ]
          }
        },
        {
          path: '/tool/sc',
          name: 'toolSc',
          component: () => import('_v/tool/sc.vue'),
          meta: {
            title: '单细胞工具'
          }
        },
        {
          path: '/tool/st',
          name: 'toolSt',
          component: () => import('_v/tool/st.vue'),
          meta: {
            title: '空间工具'
          }
        }
      ]
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
