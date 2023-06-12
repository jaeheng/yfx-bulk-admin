<template>
  <div class="accounts-edit">
    <BreadCrumb />
    <el-card shadow="hover" header="修改账号">
      <el-form :model="form" :rules="rules" label-width="120px" label-position="left" v-loading="loading" ref="form">
        <el-form-item label="项目编号:">
          {{ project }}
        </el-form-item>
        <el-form-item label="平台:" prop="user_type">
          <el-radio-group v-model="form.user_type" :disabled="!isRoot">
            <el-radio :label="SINGLE_CELL_DATA">单细胞平台</el-radio>
            <el-radio :label="SPATIAL_DATA">空间平台</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="项目名称:" prop="username">
          <el-input v-model="form.username" placeholder="请输入项目名称" />
        </el-form-item>
        <el-form-item label="物种:" prop="species">
          <el-radio-group v-model="form.species" v-loading="speciesLoading" @change="speciesChange" :disabled="!isRoot">
            <el-radio :label="item.id" v-for="item in speciesList" :key="item.id">{{ item.alias }}</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="注释库:" prop="annotation_library_id">
          <el-select v-model="form.annotation_library_id" v-loading="annotationLibraryLoading" :disabled="!isRoot">
            <el-option v-for="item in annotationLibrary" :key="item.id" :label="item.name" :value="item.id"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="公司:" prop="company_id">
          <el-select v-model="form.company_id" :disabled="!isRoot">
            <el-option v-for="item in company" :key="item.id" :value="item.id" :label="item.company_name"></el-option>
          </el-select>
        </el-form-item>
        <el-form-item label="剩余任务数:" prop="allow_task_number">
          <el-input v-model="form.allow_task_number" placeholder="请输入剩余任务数" />
        </el-form-item>
        <el-form-item label="原始文件路径:" prop="raw_path">
          <el-input v-model="form.raw_path" placeholder="/" />
        </el-form-item>
        <el-form-item label="联系人邮箱:" prop="email">
          <el-input v-model="form.email" placeholder="请输入联系人邮箱" />
        </el-form-item>
        <el-form-item label="账号状态:" prop="state">
          <el-radio-group v-model="form.state">
            <el-radio :label="1">可用</el-radio>
            <el-radio :label="0">禁用</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="截至日期:" prop="due_date">
          <el-date-picker
              v-model="form.due_date"
              type="date"
              placeholder="请选择账号截至日期"
              format="YYYY/MM/DD"
              value-format="X"
          />
        </el-form-item>
        <el-form-item>
          <el-button type="primary" @click="submitHandle" :loading="submitting">确认修改</el-button>
        </el-form-item>
      </el-form>
    </el-card>
  </div>
</template>

<script>
import {getAnnotationList, getSpeciesList} from "@/request/modules/species";
import BreadCrumb from "_c/BreadCrumb.vue";
import {SINGLE_CELL_DATA, SPATIAL_DATA} from "@/config/app";

export default {
  components: {BreadCrumb},
  data () {
    return {
      project: '',
      form: {
        id: this.$route.params.id,
        user_type: '',
        username: '',
        company_id: '',
        email: '',
        allow_task_number: 20,
        raw_path: '',
        state: 1,
        species: '0',
        annotation_library_id: '',
        due_date: ''
      },
      rules: {
        user_type: [
          { required: true, message: '请选择平台', trigger: 'blur' }
        ],
        project: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        username: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        company_id: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        allow_task_number: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        raw_path: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请填写该字段', trigger: 'blur' }
        ],
        state: [
          { required: true, message: '请填写该字段', trigger: 'change' }
        ],
        species: [
          { required: true, message: '请选择物种', trigger: 'change' }
        ],
        annotation_library_id: [
          { required: true, message: '请选择注释库', trigger: 'change' }
        ],
        due_date: [
          { required: true, message: '请选择截至日期', trigger: 'change' }
        ]
      },
      loading: false,
      submitting: false,
      company: [],
      companyEditAble: false,
      speciesLoading: false,
      speciesList: [],
      annotationLibraryLoading: false,
      annotationLibrary: [],
      SINGLE_CELL_DATA,
      SPATIAL_DATA
    }
  },
  methods: {
    fetchData () {
      let id = this.form.id
      this.loading = true
      this.$util.get(this.api.projectInfo, { id }, resp => {
        this.project = resp.project
        this.form.user_type = resp.user_type
        this.form.username = resp.username
        this.form.company_id = resp.company_id
        this.form.raw_path = resp.raw_path
        this.form.state = resp.state
        this.form.allow_task_number = resp.allow_task_number
        this.form.email = resp.email
        this.form.species = resp.species
        this.form.annotation_library_id = resp.annotation_library_id
        this.form.due_date = resp.due_date
        this.isRoot = resp.pid === 0
        this.loading = false
        this.fetchCompany()
        this.getSpeciesList()
      }, () => {
        this.loading = false
      })
    },
    submitHandle () {
      let form = this.form
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          this.$util.post(this.api.projectEdit, form, () => {
            this.$message.success('修改成功')
            this.submitting = false
            this.$router.push('/accounts')
          }, () => {
            this.submitting = false
          })
        }
      })
    },
    fetchCompany () {
      this.loading = true
      this.$util.get(this.api.companyList, {}, resp => {
        this.company = resp
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    getSpeciesList () {
      this.speciesLoading = true
      getSpeciesList({}).then(resp => {
        this.speciesList = resp
        this.speciesLoading = false
        this.getAnnotationLibrary()
      }).catch(() => {
        this.speciesLoading = false
      })
    },
    getAnnotationLibrary () {
      this.annotationLibraryLoading = true
      getAnnotationList({ species_id: this.form.species }).then(resp => {
        this.annotationLibrary = resp
        this.annotationLibraryLoading = false
      }).catch(() => {
        this.annotationLibraryLoading = false
      })
    },
    speciesChange() {
      this.form.annotation_library_id = ''
      this.getAnnotationLibrary()
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
