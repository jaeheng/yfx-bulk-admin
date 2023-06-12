<template>
  <el-dialog v-model="visible" :title="(isEdit ? '编辑' : '新建') + '公共数据库'" :close-on-click-modal="false" width="500px">
    <el-form :model="form" label-position="left" label-width="120px" :rules="rules" ref="form">
      <el-form-item label="数据库名称" prop="category_name">
        <el-input v-model="form.category_name" placeholder="请填写公共数据库名称" />
      </el-form-item>
      <el-form-item label="数据库介绍" prop="category_desc">
        <el-input v-model="form.category_desc" type="textarea" placeholder="请填写公共数据库介绍" />
      </el-form-item>
      <el-form-item label="所属物种" prop="species">
        <el-radio-group v-model="form.species" v-loading="speciesLoading">
          <el-radio v-for="item in species" :key="item.id" :label="item.id"> {{ item.alias }} </el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submit" :loading="submitting">确认</el-button>
        <el-button @click="close">取消</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import { geneSetCategoryCreate, geneSetCategoryEdit } from '@/request/modules/geneSetCategory'
import {getSpeciesList} from "@/request/modules/species";

export default {
  emits: ['success'],
  data () {
    return {
      visible: false,
      form: {
        category_name: '',
        category_desc: '',
        species: ''
      },
      rules: {
        category_name: [
          { required: true, message: '数据库名称是必填项', trigger: 'blur' }
        ],
        category_desc: [
          { required: true, message: '数据库介绍是必填项', trigger: 'blur' }
        ],
        species: [
          { required: true, message: '所属物种是必选项', trigger: 'change' }
        ]
      },
      species: [],
      speciesLoading: false,
      submitting: false,
      id: 0
    }
  },
  computed: {
    isEdit () {
      return !!this.id
    }
  },
  methods: {
    show (row) {
      if (row && row.id) {
        this.id = row.id
        this.form.category_name = row.category_name
        this.form.category_desc = row.category_desc
        this.form.species = row.species.id
      } else {
        // 创建按钮，需要清空表单
        this.clear()
      }
      this.visible = true
      this.fetchSpecies()
    },
    close () {
      this.visible = false
    },
    clear () {
      Object.keys(this.form).map(key => {
        this.form[key] = ''
      })
    },
    fetchSpecies () {
      this.speciesLoading = true
      getSpeciesList({}).then(resp => {
        this.species = resp
        this.speciesLoading = false
      }).catch(() => {
        this.speciesLoading = false
      })
    },
    submit () {
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          const request = this.id ? geneSetCategoryEdit : geneSetCategoryCreate
          const data = {
            ...this.form
          }
          if (this.id) {
            data.id = this.id
          }
          request(data).then(resp => {
            this.$message.success('保存成功')
            this.$emit('success')
            this.submitting = false
            this.close()
          }).catch(() => {
            this.submitting = false
          })
        }
      })
    }
  }
}
</script>
