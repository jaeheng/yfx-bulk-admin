<template>
  <div class="accounts-list">
    <page-header description="管理项目账号信息" :image="image" >
      <router-link to="/accounts/create">
        <el-button type="primary"> <i class="iconfont icon-plus"></i> 创建账号</el-button>
      </router-link>
    </page-header>
    <el-card style="margin: 15px 0;" shadow="hover">
      <el-form>
        <el-row :gutter="15">
          <el-col :span="6">
            <el-form-item label="所属公司:">
              <el-select v-model="form.company_id" v-loading="companyLoading" class="full-width">
                <el-option :value="0" label="所有"></el-option>
                <el-option :value="item.value" :label="item.label" v-for="item in company" :key="item.value"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="平台">
              <el-select v-model="form.user_type" class="full-width">
                <el-option value="all" label="所有平台"></el-option>
                <el-option :value="SINGLE_CELL_DATA" label="单细胞"></el-option>
                <el-option :value="SPATIAL_DATA" label="空间"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="关键字:">
              <el-input class="search" v-model="form.keyword" @keyup.enter="search" placeholder="请输入关键字搜索" />
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item>
              <el-button type="primary" @click="search">搜索</el-button>
              <el-button @click="showMore = !showMore">
                <i class="iconfont icon-more"></i>
              </el-button>
            </el-form-item>
          </el-col>
        </el-row>
        <el-row :gutter="15" style="margin-top: 15px;" v-if="showMore">
          <el-col :span="6">
            <el-form-item label="账号状态:">
              <el-select v-model="form.state" class="full-width">
                <el-option :value="0" label="已禁用"></el-option>
                <el-option :value="1" label="正常"></el-option>
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="6">
            <el-form-item label="展示形式">
              <el-radio-group v-model="form.displayType">
                <el-radio label="normal">顺序</el-radio>
                <el-radio label="tree">树形</el-radio>
              </el-radio-group>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
    </el-card>
    <el-card header="账号列表" shadow="hover">
      <el-table :data="tableData" v-loading="loading" size="small" row-key="id">
        <el-table-column label="ID" prop="id" width="120" />
        <el-table-column label="项目编号" prop="project" />
        <el-table-column label="所属公司" prop="company.company_name"></el-table-column>
        <el-table-column label="物种" prop="species.alias" width="100" />
        <el-table-column label="注释库" prop="library.name" width="100" />
        <el-table-column label="任务数" prop="task_count" width="100" />
        <el-table-column label="平台" width="100">
          <template #default="scope">
            {{ platformText[scope.row.user_type] }}
          </template>
        </el-table-column>
        <el-table-column label="样本数" width="100">
          <template #default="scope">
            {{ scope.row.sample_count }}
          </template>
        </el-table-column>
        <el-table-column label="创建时间" prop="created_at" width="220">
          <template #default="scope">
            <el-link
                v-if="scope.row.pid === 0"
                :underline="false"
                :title="'截至日期：' + dateFmt(scope.row.due_date)"
                :type="scope.row.due_date - now > 0 ? 'default' : 'danger'">
              {{ scope.row.created_at }}
              {{ scope.row.due_date - now > 0 ? '' : '(已过期)' }}</el-link>
            <el-link v-else :underline="false">{{ scope.row.created_at }}</el-link>
          </template>
        </el-table-column>
        <el-table-column label="导入状态" width="100">
          <template #default="scope">
            <!-- -2待导入-1排队中 0开始导入 1导入成功 2导入失败 -->
            <el-popover
                :width="600"
                placement="left-end"
                trigger="click"
                title="导入日志"
                popper-style="box-shadow: rgb(14 18 22 / 35%) 0px 10px 38px -10px, rgb(14 18 22 / 20%) 0px 10px 20px -15px; padding: 20px;"
            >
              <template #reference>
                <import-state :state="scope.row.import_state"></import-state>
              </template>
              <template #default>
                <pre class="import-log" v-html="scope.row.import_log || '无日志产生'"></pre>
              </template>
            </el-popover>
          </template>
        </el-table-column>
        <el-table-column label="账号状态" prop="state" width="80">
          <template #default="scope">
            <!-- 0已禁用 1可用 -->
            <div>
              <import-state :state="scope.row.state">{{ scope.row.state === 1 ? '可用' : '已禁用' }}</import-state>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="120">
          <template #default="scope">
            <router-link :to="{ name: 'accountsEdit', params: { id: scope.row.id } }">
              <el-button size="small" type="primary" circle plain>
                <i class="iconfont icon-edit"></i>
              </el-button>
            </router-link>

            <router-link :to="{ name: 'accountsField', params: { id: scope.row.id } }" style="margin: 0 10px;">
              <el-button size="small" type="warning" circle plain>
                <i class="iconfont icon-select"></i>
              </el-button>
            </router-link>

            <more :data="scope.row" style="margin-left: 10px;" @freshData="fetchData"></more>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
          background
          :layout="PAGE_LAYOUT"
          :total="total"
          :hide-on-single-page="true"
          :page-size="perPage"
          v-model:currentPage="page">
      </el-pagination>
    </el-card>
  </div>
</template>

<style lang="scss" scoped>
.accounts {
  padding-bottom: 50px;
  .el-form-item--large {
    margin-bottom: 0;
  }
}
.import-log {
  font-size: 13px;
  max-height: 300px;
  overflow-y: auto;
  white-space: pre-wrap;
}
</style>
<style lang="scss">
.import-log {
  span {
    display: inline-block;
    width: 100px;
    text-align: center;
  }
}
</style>

<script>
import {PAGE_LAYOUT, SINGLE_CELL_DATA, SPATIAL_DATA} from '@/config/app'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/project.png'
import {getCompanyList} from "@/request/modules/company"
import more from './more.vue'
import {dateFmt} from "@/libs/functions";
import ImportState from "_c/ImportState.vue";
export default {
  components: {
    PageHeader,
    more,
    ImportState
  },
  watch: {
    page () {
      this.fetchData()
    }
  },
  data () {
    return {
      total: 0,
      page: 1,
      now: new Date().getTime() / 1000,
      form: {
        company_id: 0,
        keyword: '',
        state: 1,
        displayType: 'tree',
        user_type: 'all'
      },
      tableData: [],
      company: [],
      perPage: 0,
      PAGE_LAYOUT,
      loading: false,
      companyLoading: false,
      image,
      importState: {
        '-3': '待激活',
        '-2': '等待',
        '-1': '排队',
        '0': '进行',
        '1': '成功',
        '2': '失败'
      },
      SINGLE_CELL_DATA,
      SPATIAL_DATA,
      showMore: false
    }
  },
  computed: {
    platformText () {
      const text = {}
      text[SINGLE_CELL_DATA] = '单细胞平台'
      text[SPATIAL_DATA] = '空间平台'
      return text
    }
  },
  methods: {
    fetchData () {
      let page = this.page
      this.loading = true
      this.$util.get(this.api.project, { page, ...this.form }, resp => {
        this.tableData = resp.list || []
        this.total = resp.total || 0
        this.perPage = resp.perPage || 15
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    /**
     * 搜索
     */
    search () {
      this.currentChange(1)
    },
    /**
     * 翻页
     */
    currentChange (page) {
      this.page = page
      this.fetchData()
    },
    showClusterInfo (row) {
      const recluster = row.recluster_user
      let str = `<p><strong>当前账号:</strong> ${row.project}</p>`

      if (recluster.parent) {
        str += `<p><strong>父类账号:</strong> ${recluster.parent.user.project}</p>`
      }
      str += `<p><strong>原始账号:</strong> ${recluster.root.project}</p>`
      this.$alert(str, '聚类关系', {
        dangerouslyUseHTMLString: true,
      })
    },
    getCompanyList () {
      this.companyLoading = true
      getCompanyList({}).then(resp => {
        this.company = resp.map(item => {
          return {
            label: item.company_name,
            value: item.id
          }
        })
        this.companyLoading = false
      }).catch(() => {
        this.companyLoading = false
      })
    },
    dateFmt (second) {
      return dateFmt(second)
    }
  },
  mounted () {
    this.getCompanyList()
    this.fetchData()
  }
}
</script>
