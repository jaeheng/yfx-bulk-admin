<template>
  <page-header description="管理系统更新记录" :image="image"></page-header>
  <el-card style="margin: 15px 0;" shadow="hover">
    <el-form inline>
      <el-form-item style="margin-bottom: 0;">
        <el-button type="primary" @click="showAddDialog"> <i class="iconfont icon-plus"></i> 新建更新记录</el-button>
      </el-form-item>
    </el-form>
  </el-card>

  <el-card shadow="hover" header="系统更新记录">
    <el-alert type="warning" style="margin-bottom: 10px;">已发布的更新记录不可操作,如需操作先切换状态</el-alert>
    <el-table :data="list" v-loading="loading" size="small">
      <el-table-column label="ID" prop="id" width="80" />
      <el-table-column label="标题" prop="title" width="150" />
      <el-table-column label="内容">
        <template #default="scope">
          <ul v-html="formatContent(scope.row.content)"></ul>
        </template>
      </el-table-column>
      <el-table-column label="创建时间" prop="created_at" width="200" />
      <el-table-column label="状态" width="80">
        <template #default="scope">
          <el-tag type="success" size="small" v-if="scope.row.state === 1">已发布</el-tag>
          <el-tag type="info" size="small" v-else>未发布</el-tag>
        </template>
      </el-table-column>
      <el-table-column label="操作" width="280">
        <template #default="scope">
          <el-button type="primary" plain size="small" @click="toggleStatus(scope.row)">状态切换</el-button>
          <el-button type="primary" plain size="small" @click="showUpdateDialog(scope.row)" :disabled="!!scope.row.state">修改</el-button>
          <el-button type="danger" size="small" @click="deleteItem(scope.row)" :disabled="!!scope.row.state">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <el-pagination
        background
        :layout="$appConfig.pageLayout"
        :total="total"
        :page-size="pageSize"
        @current-change="currentChange">
    </el-pagination>
  </el-card>

  <el-dialog v-model="visible" :title="dialogTitle" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" ref="form">
      <el-form-item label="标题:" prop="title">
        <el-input v-model="form.title" placeholder="请输入标题"></el-input>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        内容请按格式书写： 每行以 <code>A/U/F</code> 开头, 其中 A新增 U更新 F修复
        <el-input v-model="form.content" type="textarea" :autosize="{ minRows: 5, maxRows: 10 }" placeholder="请输入内容"></el-input>
      </el-form-item>
    </el-form>
    <div style="text-align: right">
      <el-button @click="visible = false">关 闭</el-button>
      <el-button type="primary" @click="save" :loading="submitting">保 存</el-button>
    </div>
  </el-dialog>
</template>

<style>
  .upgrade ul {
    padding-left: 0;
  }
</style>

<script>
import { inArray } from '@/libs/functions'
import image from '@img/user.png'
import PageHeader from "_c/PageHeader.vue";
export default {
  components: {PageHeader},
  data () {
    return {
      image,
      list: [],
      page: 1,
      total: 0,
      pageSize: this.$appConfig.pageSize,
      visible: false,
      form: {
        id: 0,
        title: '',
        content: ''
      },
      rules: {
        title: [
          { required: true, message: '标题不可为空', trigger: 'blur' }
        ],
        content: [
          { required: true, message: '内容不可为空', trigger: 'blur' }
        ]
      },
      submitting: false,
      loading: false
    }
  },
  computed: {
    dialogTitle () {
      return (this.form.id ? '更新' : '新建') + '系统更新记录'
    }
  },
  methods: {
    currentChange (page) {
      this.page = page
      this.fetchData()
    },
    fetchData () {
      let page = this.page
      this.loading = true
      this.$util.get(this.api.version, { page }, resp => {
        this.list = resp.list || []
        this.total = resp.total || 0
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    save () {
      let form = this.form
      let api = form.id ? this.api.versionUpdate : this.api.versionCreate
      let data = { ...form }
      if (data.id === 0) {
        delete data.id
      }
      this.submitting = true
      this.$util.post(api, data, resp => {
        this.$message.success('保存成功!')
        this.submitting = false
        this.visible = false
        this.fetchData()
      }, () => {
        this.submitting = false
      })
    },
    showUpdateDialog (row) {
      this.form.id = row.id
      this.form.title = row.title
      this.form.content = row.content
      this.visible = true
    },
    showAddDialog () {
      let date = new Date()
      let year = date.getFullYear()
      let month = (date.getMonth() + 1)
      month = month < 10 ? '0' + month : month
      let day = date.getDate()
      day = day < 10 ? '0' + day : day
      this.showUpdateDialog({
        id: 0,
        title: year + '-' + month + '-' + day,
        content: ''
      })
    },
    formatContent (content) {
      let arr = content.split('\n')
      let str = []
      arr.map(item => {
        if (inArray(item[0], ['A', 'U', 'F'])) {
          str.push(`<code>${item[0]}</code> ` + item.slice(1))
        } else {
          str.push(item)
        }
      })
      return '<li>' + str.join('</li><li>') + '</li>'
    },
    toggleStatus (row) {
      let id = row.id
      let state = row.state
      let text = state ? '隐藏' : '发布'
      this.$confirm(`确定${text}该记录?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$util.post(this.api.versionChange, { id }, resp => {
          this.$message.success('更改状态成功')
          this.fetchData()
        })
      }).catch(() => {})
    },
    deleteItem (row) {
      let id = row.id
      let title = row.title
      this.$confirm(`确定删除 ${title}?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        this.$util.post(this.api.versionDelete, { id }, resp => {
          this.$message.success('删除成功')
          this.fetchData()
        })
      }).catch(() => {})
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
