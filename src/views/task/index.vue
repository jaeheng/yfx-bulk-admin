<template>
  <div class="task">
    <page-header description="对系统任务进行查询、操作" has-bread :image="image" />
    <div class="container">
      <el-card header="搜索条件" shadow="hover">
        <el-form :model="form" label-width="120px" label-position="left">
          <el-form-item label="所属项目:" class="full-width">
            <el-select
                v-model="form.uid"
                filterable
                remote
                clearable
                reserve-keyword
                placeholder="请输入关键词搜索所属项目"
                :remote-method="remoteMethod"
                :loading="uidLoading"
                class="full-width">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="状态筛选:" class="full-width">
            <el-select
                v-model="form.state"
                multiple
                collapse-tags
                placeholder="可多选"
                class="full-width"
            >
              <el-option label="未开始" :value="-1"></el-option>
              <el-option label="进行中" :value="0"></el-option>
              <el-option label="成功" :value="1"></el-option>
              <el-option label="失败" :value="2"></el-option>
              <el-option label="写入中" :value="3"></el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="关键字:" class="full-width">
            <el-input class="search" v-model="form.keyword" @keyup.enter="search" placeholder="请输入关键字" clearable />
          </el-form-item>
          <el-form-item label="创建时间:" class="full-width">
            <el-date-picker
                v-model="form.rangTime"
                type="daterange"
                unlink-panels
                range-separator="到"
                start-placeholder="开始时间"
                end-placeholder="结束时间"
                format="YYYY/MM/DD"
                value-format="YYYY-MM-DD"
                :shortcuts="shortcuts"
            />
          </el-form-item>
          <el-form-item label="展示形式">
            <el-radio-group v-model="form.displayType">
              <el-radio label="normal">顺序</el-radio>
              <el-radio label="tree">树形</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="search">搜索</el-button>
          </el-form-item>
        </el-form>
      </el-card>

      <el-card shadow="hover" header="任务列表" style="margin-top: 10px;">
        <el-table :data="tableData" v-loading="loading" size="small" row-key="id" default-expand-all>
          <el-table-column label="ID" prop="id" width="120" />
          <el-table-column label="任务名称" prop="task_name" />
          <el-table-column label="所属项目" prop="project.project" />
          <el-table-column label="分析工具" prop="analysis_tool.tool_name" />
          <el-table-column label="创建时间" prop="created_at" />
          <el-table-column label="类型" prop="data_type" width="100">
            <template #default="scope">
              <span v-if="scope.row.data_type === dataType.cell">细胞</span>
              <span v-if="scope.row.data_type === dataType.gene">基因</span>
              <span v-if="scope.row.data_type === dataType.stCell">空间位点</span>
              <span v-if="scope.row.data_type === dataType.stGene">空间基因</span>
            </template>
          </el-table-column>
          <el-table-column label="状态" width="100">
            <template #default="scope">
              <!-- -1未开始  0进行中  1成功 2 失败 3写入中 -->
              <import-state :state="scope.row.state">{{ state[scope.row.state].text }}</import-state>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="100">
            <template #default="scope">
              <more :data="scope.row"></more>
            </template>
          </el-table-column>
        </el-table>

        <el-pagination
            background
            :layout="PAGE_LAYOUT"
            :total="total"
            :page-size="perPage"
            v-model:currentPage="page"
            @current-change="currentChange">
        </el-pagination>
      </el-card>
    </div>
  </div>
</template>

<style lang="scss">
  .task {
    padding-bottom: 50px;
    .el-form-item--large {
      margin-bottom: 5px;
    }
  }
</style>

<script>
import PageHeader from '_c/PageHeader.vue'
import more from '_c/TaskMore.vue'
import image from '@img/task.png'
import {PAGE_LAYOUT, TASK_STATE} from "@/config/app";
import ImportState from "_c/ImportState.vue";
export default {
  components: {
    PageHeader,
    more,
    ImportState
  },
  data () {
    return {
      image,
      total: 0,
      page: 1,
      tableData: [],
      perPage: 15,
      PAGE_LAYOUT,
      dataType: this.$appConfig.dataType,
      loading: false,
      form: {
        keyword: '',
        state: [],
        uid: '',
        displayType: 'normal',
        rangTime: []
      },
      uidLoading: false,
      toolLoading: false,
      options: [],
      state: TASK_STATE,
      shortcuts: [
        {
          text: '最近一周',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
            return [start, end]
          },
        },
        {
          text: '最近一月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
            return [start, end]
          },
        },
        {
          text: '最近三月',
          value: () => {
            const end = new Date()
            const start = new Date()
            start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
            return [start, end]
          },
        },
      ]
    }
  },
  methods: {
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
    fetchData () {
      let page = this.page
      let form = this.form
      this.loading = true
      this.$util.get(this.api.task, { page, ...form }, resp => {
        this.tableData = resp.list || []
        this.total = resp.total || 0
        this.perPage = resp.perPage || 15
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    remoteMethod (query) {
      if (query) {
        let page = 1
        this.uidLoading = true
        this.$util.get(this.api.project, { page, keyword: query }, resp => {
          if (resp.list) {
            this.options = resp.list.map(item => {
              return {
                value: item.id,
                label: item.project
              }
            })
          } else {
            this.options = []
          }
          this.uidLoading = false
        }, () => {
          this.uidLoading = false
        })
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
