<template>
  <el-drawer
    :title="category.category_name"
    v-model="visible"
    direction="rtl"
    size="800px">
    <div style="padding: 15px;">
      <div class="uploader">
        <el-upload
          class="upload-demo"
          drag
          :accept="allowExtString"
          :before-upload="beforeUpload"
          :on-success="success"
          :data="{ id: category.id }"
          :headers="{ Authorization: token }"
          :action="GENESET_PUBLIC_UPLOAD">
          <i class="iconfont icon-upload"></i>
          <div class="el-upload__text">上传文件导入基因集</div>
          <template #tip>
            <div class="el-upload__tip">只能上传{{ allowExtString }}文件，且不超过{{ allowSize }}MB</div>
          </template>
        </el-upload>
      </div>
      <el-table :data="list" size="small">
        <el-table-column property="name" label="名称" />
        <el-table-column property="remarks" label="备注" width="120px" />
        <el-table-column property="total" label="基因数" width="80px" />
        <el-table-column property="genes" label="基因" width="80px">
          <template #default="scope">
            <el-button size="small" type="primary" @click="$alert(scope.row.genes.join(','), '基因列表')">查看</el-button>
          </template>
        </el-table-column>
      </el-table>

      <el-pagination
        background
        :layout="$appConfig.pageLayout"
        :total="total"
        :page-size="$appConfig.pageSize"
        @current-change="currentChange">
      </el-pagination>
    </div>
  </el-drawer>
</template>

<style>
.uploader {
  background: #eee;
  text-align: center;
  padding: 15px;
}
</style>

<script>
import { GENESET_PUBLIC_UPLOAD, genesetsPublic } from '@/request/modules/geneSetCategory'
import { inArray } from '@/libs/functions'
import {getToken} from "../../../libs/storage";
export default {
  data () {
    return {
      category: {},
      visible: false,
      list: [],
      GENESET_PUBLIC_UPLOAD,
      allowSize: 10, // MB
      allowExt: ['txt'],
      uploading: false,
      page: 1,
      total: 0,
      token: getToken()
    }
  },
  computed: {
    allowExtString () {
      return this.allowExt.map(item => `.${item}`).join(',')
    }
  },
  methods: {
    show (category) {
      this.visible = true
      this.category = category
      this.fetchData()
    },
    fetchData () {
      const page = this.page
      genesetsPublic({ id: this.category.id, page }).then(resp => {
        this.list = resp.list
        this.total = resp.total
      })
    },
    success (resp, file) {
      if (resp.code === 200) {
        this.$message.success('上传导入成功')
        this.fetchData()
      } else {
        this.$message.error(resp.message)
      }
    },
    beforeUpload (file) {
      const ext = this.$util.getSuffix(file.name)
      if (file.size > this.allowSize * 1024 * 1024) {
        this.$message.error(`文件不能超过 ${this.allowSize}M!`)
        return false
      }
      if (inArray(ext, this.allowExt, 0) === false) {
        this.$message.error('文件类型错误,必须是: ' + this.allowExtString)
        return false
      }
      this.uploading = true
      return true
    },
    currentChange (page) {
      this.page = page
      this.fetchData()
    }
  }
}
</script>
