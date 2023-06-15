<template>
  <div class="pass">
    <page-header description="管理试用申请信息" :image="image" />
    <el-card style="margin: 15px 0;" shadow="hover">
      <el-form inline>
        <el-form-item style="margin-bottom: 0;">
          <el-input class="search" v-model="keyword" @keyup.enter="search" placeholder="请输入关键字搜索">
            <template #append>
              <el-button @click="search">搜索</el-button>
            </template>
          </el-input>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card shadow="hover" header="试用申请列表">
      <el-table :data="tableData" v-loading="loading" stripe size="small">
        <el-table-column type="expand">
          <template #default="scope">
            <h3>研究领域</h3>
            <p>{{ scope.row.research_field }}</p>
            <p>{{ scope.row.researchFieldOther }}</p>

            <div style="padding: 15px 0;border-top: 1px solid #eee; border-bottom: 1px solid #eee; margin-top: 10px;margin-bottom: 10px;">
              <h3>您感兴趣的单细胞分析需求有哪些?</h3>
              <p>{{ scope.row.interest }}</p>
              <p>{{ scope.row.interestOther }}</p>
            </div>

            <h3>联系方式</h3>
            <p><strong>手机号：</strong> {{ scope.row.phone }}</p>
            <p><strong>Email:</strong> {{ scope.row.email }}</p>
          </template>
        </el-table-column>
        <el-table-column label="ID" prop="id" width="70" />
        <el-table-column label="姓名" prop="name" />
        <el-table-column label="单位/机构" prop="company" />
        <el-table-column label="职位/职称" prop="position" />
        <el-table-column label="自建数据">
          <template #default="scope">
            <!-- 0否 1是 -->
            <el-tag size="small" type="success" v-if="parseInt(scope.row.build_data) === 1">是</el-tag>
            <el-tag size="small" type="info" v-if="parseInt(scope.row.build_data) === 0">否</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="是否需要联系">
          <template #default="scope">
            <!-- 0不需要 1需要 -->
            <el-tag size="small" type="success" v-if="parseInt(scope.row.contact) === 1">需要</el-tag>
            <el-tag size="small" type="info" v-if="parseInt(scope.row.contact) === 0">不需要</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="申请时间" prop="created_at" />
        <el-table-column label="申请ip" prop="ip" />
        <el-table-column label="申请状态">
          <template #default="scope">
            <!-- 0未创建 1已创建 -->
            <el-tag size="small" type="success" v-if="scope.row.state === 1">已创建账号</el-tag>
            <el-tag size="small" type="info" v-if="scope.row.state === 0">未创建账号</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作" width="130">
          <template #default="scope">
            <el-button size="small" type="primary" @click="changeState(scope.row)" :disabled="!!scope.row.state">一键创建账号</el-button>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-pagination
      background
      :layout="$appConfig.pageLayout"
      :total="total"
      :hide-on-single-page="true"
      :page-size="PAGE_SIZE"
      v-model:currentPage="page">
    </el-pagination>
  </div>
</template>

<script>
import { PAGE_SIZE } from '@/config/app'
import PageHeader from "_c/PageHeader.vue";
import image from '@img/pass.svg'
export default {
  components: {PageHeader},
  data () {
    return {
      total: 0,
      page: 1,
      keyword: '',
      tableData: [],
      PAGE_SIZE,
      loading: false,
      image
    }
  },
  watch: {
    page () {
      this.fetchData()
    }
  },
  methods: {
    fetchData () {
      let page = this.page
      let keyword = this.keyword
      this.loading = true
      this.$util.get(this.api.trial, { page, keyword }, resp => {
        this.tableData = resp.list || []
        this.total = resp.total || 0
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    /**
     * 搜索
     */
    search () {
      this.page = 1
      this.fetchData()
    },
    /**
     * 切换状态：是否创建账号
     */
    changeState (row) {
      this.$confirm('确定要根据申请信息创建账号?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        let id = row.id
        let state = row.state
        if (!state) {
          this.$util.post(this.api.trialSave, { id }, resp => {
            this.$message.success('申请状态切换成功!')
            this.fetchData()
          })
        } else {
          this.$message.error('该申请已经创建过账号了')
        }
      }).catch(() => {
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
