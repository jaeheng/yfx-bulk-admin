<template>
  <div class="company">
    <PageHeader :has-bread="true" description="公司信息管理,包括公司访问端口、公司名称、可用工具等配置" :image="image">
      <el-button type="primary" @click="create">新建公司信息</el-button>
    </PageHeader>

    <el-card header="公司列表" shadow="hover">
      <el-table :data="list" v-loading="loading">
        <el-table-column type="expand">
          <template #default="scope">
            <el-descriptions
                class="margin-top"
                :column="1"
                border
            >
              <el-descriptions-item label="工具">
                <el-tag :key="item.id"
                        :type="item.data_type ? 'info' : ''"
                        style="margin-right: 10px;margin-bottom: 10px;"
                        v-for="item in scope.row.tool_available">
                  <img :src="item.image" alt="">
                  {{ item.tool_name }}( {{ item.tool_key }} )</el-tag>
              </el-descriptions-item>
              <el-descriptions-item label="Logo">
                <div class="avatar-uploader" @click="openUpload(scope.row, 'logo')">
                  <img v-if="scope.row.logo" :src="scope.row.logo" class="avatar">
                  <i v-else class="iconfont icon-plus avatar-uploader-icon"></i>
                </div>
                <p class="item-title">公司logo</p>
              </el-descriptions-item>
            </el-descriptions>
          </template>
        </el-table-column>
        <el-table-column label="公司名称" prop="company_name" width="250">
          <template #default="scope">
            {{ scope.row.company_name }} <i class="iconfont icon-remark clickable" @click="$alert(scope.row.remark, '备注')" v-if="scope.row.remark"></i>
          </template>
        </el-table-column>
        <el-table-column label="端口" prop="sld" sortable>
          <template #default="scope">
            {{ scope.row.sld }} <i class="iconfont icon-link clickable" @click="open(scope.row)"></i>
          </template>
        </el-table-column>
        <el-table-column label="项目数" prop="project_count" sortable></el-table-column>
        <el-table-column label="创建时间" prop="created_at" sortable></el-table-column>
        <el-table-column label="可访问">
          <template #default="scope">
            <check :id="scope.row.id"></check>
          </template>
        </el-table-column>
        <el-table-column label="状态">
          <template #default="scope">
            <el-tag size="small" type="danger" v-if="scope.row.state === 0">已禁用</el-tag>
            <el-tag size="small" type="success" v-else>正常</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template #default="scope">
            <el-link type="primary" @click="edit(scope.row)">编辑</el-link>
          </template>
        </el-table-column>
      </el-table>
    </el-card>

    <el-drawer
        :title="drawerTitle"
        v-model="drawer"
        :close-on-click-modal="false"
        direction="rtl"
        size="70%"
    >
      <div style="padding: 25px 40px;">
        <el-form :model="form" :rules="rules" label-position="top">
          <el-row :gutter="10">
            <el-col :span="8">
              <el-form-item label="名称:" prop="company_name">
                <el-input v-model="form.company_name" placeholder="请输入公司名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="二级域名:" prop="sld">
                <el-input type="text" v-model="form.sld" placeholder="请输入公司的二级域名"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="8">
              <el-form-item label="状态:" prop="state">
                <el-radio-group v-model="form.state">
                  <el-radio :label="1">可用</el-radio>
                  <el-radio :label="0">禁用</el-radio>
                </el-radio-group>
              </el-form-item>
            </el-col>
          </el-row>

          <el-form-item label="可用的单细胞工具:" v-loading="loadingTools">
            <div style="background: #f5f7fa;padding: 15px;line-height: 2;">
              <div>
                <strong>细胞工具</strong>
                <div style="float: right">
                  <el-link type="primary" style="margin-right: 10px" @click="checkAllTool('cellToolsModel', 'cellTools')">全选</el-link>
                  <el-link type="primary"  @click="checkNoneTool('cellToolsModel')">全不选</el-link>
                </div>
              </div>
              <el-checkbox-group v-model="cellToolsModel">
                <el-checkbox :label="item.id" :key="item.id" v-for="item in cellTools">{{ item.id }}.{{ item.tool_name }}</el-checkbox>
              </el-checkbox-group>
              <div>
                <strong>基因工具</strong>
                <div style="float: right">
                  <el-link type="primary" style="margin-right: 10px" @click="checkAllTool('geneToolsModel', 'geneTools')">全选</el-link>
                  <el-link type="primary"  @click="checkNoneTool('geneToolsModel')">全不选</el-link>
                </div>
              </div>
              <el-checkbox-group v-model="geneToolsModel">
                <el-checkbox :label="item.id" :key="item.id" v-for="item in geneTools">{{ item.id }}.{{ item.tool_name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="可用的空间工具:" v-loading="loadingTools">
            <div style="background: #f5f7fa;padding: 15px;line-height: 2;">
              <div>
                <strong>空间工具</strong>
                <div style="float: right">
                  <el-link type="primary" style="margin-right: 10px" @click="checkAllTool('stCellToolsModel', 'stCellTools')">全选</el-link>
                  <el-link type="primary"  @click="checkNoneTool('stCellToolsModel')">全不选</el-link>
                </div>
              </div>
              <el-checkbox-group v-model="stCellToolsModel">
                <el-checkbox :label="item.id" :key="item.id" v-for="item in stCellTools">{{ item.id }}.{{ item.tool_name }}</el-checkbox>
              </el-checkbox-group>
              <div>
                <strong>空间基因工具</strong>
                <div style="float: right">
                  <el-link type="primary" style="margin-right: 10px" @click="checkAllTool('stGeneToolsModel', 'stGeneTools')">全选</el-link>
                  <el-link type="primary"  @click="checkNoneTool('stGeneToolsModel')">全不选</el-link>
                </div>
              </div>
              <el-checkbox-group v-model="stGeneToolsModel">
                <el-checkbox :label="item.id" :key="item.id" v-for="item in stGeneTools">{{ item.id }}.{{ item.tool_name }}</el-checkbox>
              </el-checkbox-group>
            </div>
          </el-form-item>
          <el-form-item label="公司介绍:">
            <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="form.company_description" placeholder="请输入公司介绍"></el-input>
          </el-form-item>
          <el-form-item label="备注:">
            <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="form.remark" placeholder="请输入备注"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit" :loading="submitting">提交</el-button>
            <el-button @click="close">关闭</el-button>
          </el-form-item>
        </el-form>
      </div>
    </el-drawer>

    <el-dialog
        title="上传Logo"
        v-model="dialogVisible"
        width="40%">
      <div style="text-align: center">
        <el-upload
            class="upload-demo"
            drag
            :on-error="uploadError"
            :on-success="uploadSuccess"
            :accept="allowText"
            :data="{ id: current, type }"
            :headers="{ Authorization: token }"
            :action="api.companyUpload">
          <i class="iconfont icon-upload"></i>
          <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          <template #tip>
            <div class="el-upload__tip">
              只能上传{{ allow.join('/') }}文件，且不超过{{ allowSize }}MB
            </div>
          </template>
        </el-upload>
      </div>
    </el-dialog>
  </div>
</template>

<style lang="scss">
.company {
  padding-left: 0;
  list-style-type: none;
  .item-title {
    text-align: center;
    line-height: 1.5;
    font-size: 12px;
    color: #787878;
  }
  .avatar-uploader {
    border-radius: 6px;
    cursor: pointer;
    position: relative;
    overflow: hidden;
    text-align: center;
    height: 60px;
    box-sizing: border-box;
    background: #62a0f3;
    padding: 15px;
    &.h {
      margin-right: 0;
    }
    img {
      height: 100%;
    }
  }
  .avatar-uploader:hover {
    border-color: #409EFF;
  }
  .avatar-uploader-icon {
    font-size: 28px;
    color: #fff;
    width: 60px;
    height: 30px;
    line-height: 30px;
    text-align: center;
  }
  .tool-tag .el-tag {
    margin-right: 10px;
  }
  .iconfont.clickable {
    cursor: pointer;
  }
}
</style>

<script>
import check from './check.vue'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/company.png'
import {SINGLE_CELL_DATA, SPATIAL_DATA} from "@/config/app";
import {getToken} from "../../../libs/storage";
export default {
  components: {
    check,
    PageHeader
  },
  data () {
    return {
      image,
      loading: true,
      drawer: false,
      loadingTools: false,
      dialogVisible: false,
      list: [],
      form: {
        id: '',
        sld: '',
        company_name: '',
        remark: '',
        company_description: '',
        state: 1
      },
      rules: {
        sld: [
          { required: true, message: '请填写公司的二级域名', trigger: 'blur' }
        ],
        company_name: [
          { required: true, message: '请填写公司名称', trigger: 'blur' }
        ],
        remark: [],
        company_description: [],
        state: [
          { required: true, message: '请选择状态', trigger: 'change' }
        ]
      },
      submitting: false,
      current: 0,
      type: '',
      allow: ['jpg', 'jpeg', 'png', 'svg'],
      allowSize: 2, // MB
      cellTools: [],
      geneTools: [],
      stCellTools: [],
      stGeneTools: [],
      cellToolsModel: [],
      geneToolsModel: [],
      stCellToolsModel: [],
      stGeneToolsModel: [],
      token: getToken()
    }
  },
  computed: {
    drawerTitle () {
      return this.form.id ? '编辑公司信息' : '新建公司信息'
    },
    isEdit () {
      return !!this.form.id
    },
    allowText () {
      return this.allow.map(item => { return '.' + item }).join(',')
    }
  },
  methods: {
    close () {
      this.drawer = false
    },
    create () {
      this.form = {
        id: '',
        sld: '',
        company_name: '',
        remark: '',
        company_description: '',
        state: 1
      }
      this.cellToolsModel = []
      this.geneToolsModel = []
      this.stCellToolsModel = []
      this.stGeneToolsModel = []
      this.drawer = true
      this.fetchTools(SINGLE_CELL_DATA)
      this.fetchTools(SPATIAL_DATA)
    },
    edit (row) {
      Object.keys(this.form).map(key => {
        this.form[key] = row[key]
      })

      this.cellToolsModel = row.cellToolsModel
      this.geneToolsModel = row.geneToolsModel
      this.stCellToolsModel = row.stCellToolsModel
      this.stGeneToolsModel = row.stGeneToolsModel
      this.drawer = true
      this.fetchTools(SINGLE_CELL_DATA)
      this.fetchTools(SPATIAL_DATA)
    },
    submit () {
      const api = this.isEdit ? this.api.companyEdit : this.api.companyCreate
      const data = {
        ...this.form
      }
      data.tool_available = this.cellToolsModel.concat(this.geneToolsModel).join(',')
      data.st_tool_available = this.stCellToolsModel.concat(this.stGeneToolsModel).join(',')
      this.submitting = true
      this.$util.post(api, data, resp => {
        this.$message.success('保存成功')
        this.close()
        this.fetchData()
        this.submitting = false
      }, () => {
        this.submitting = false
      })
    },
    fetchData () {
      const dataType = this.$appConfig.dataType
      this.loading = true
      this.$util.get(this.api.companyList, {}, resp => {
        this.list = resp.map(item => {
          const gene = []
          const cell = []
          const stCell = []
          const stGene = []
          item.tool_available.map(v => {
            if (v.data_type === dataType.gene) {
              gene.push(v.id)
            }
            if (v.data_type === dataType.cell) {
              cell.push(v.id)
            }
          })
          item.st_tool_available.map(v => {
            if (v.data_type === dataType.stCell) {
              stCell.push(v.id)
            }
            if (v.data_type === dataType.stGene) {
              stGene.push(v.id)
            }
          })
          item.geneToolsModel = gene
          item.cellToolsModel = cell
          item.stCellToolsModel = stCell
          item.stGeneToolsModel = stGene
          return item
        })
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    openUpload (item, type) {
      this.current = item.id
      this.type = type
      this.dialogVisible = true
    },
    uploadError () {
      this.$message.error('上传错误')
    },
    uploadSuccess (resp) {
      if (resp.code === 200) {
        this.$message.success('上传成功')
        this.dialogVisible = false
        this.fetchData()
      } else {
        this.$message.error(resp.message)
      }
    },
    open (item) {
      const url = `http://${item.sld}.eanalyse.cn:20001`
      window.open(url)
    },
    fetchTools (platform) {
      const dataType = this.$appConfig.dataType
      this.loadingTools = true
      this.$util.get(this.api.tool, { platform }, resp => {
        const gene = []
        const cell = []
        if (platform === SINGLE_CELL_DATA) {
          resp.map(item => {
            if (item.data_type === dataType.gene) {
              gene.push(item)
            }
            if (item.data_type === dataType.cell) {
              cell.push(item)
            }
          })
          this.geneTools = gene
          this.cellTools = cell
        }

        if (platform === SPATIAL_DATA) {
          resp.map(item => {
            if (item.data_type === dataType.stGene) {
              gene.push(item)
            }
            if (item.data_type === dataType.stCell) {
              cell.push(item)
            }
          })
          this.stGeneTools = gene
          this.stCellTools = cell
        }

        this.loadingTools = false
      }, () => {
        this.loadingTools = false
      })
    },
    checkAllTool (model, list) {
      this[model] = this[list].map(item => {
        return item.id
      })
    },
    checkNoneTool (model) {
      this[model] = []
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
