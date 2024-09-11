<template>
  <el-dialog v-model="visible" :title="title" :close-on-click-modal="false">
    <el-form :model="form" :rules="rules" label-width="120px" label-position="left">
      <el-form-item label="英文名称:" prop="name">
        <el-input v-model="form.name" placeholder="请输入物种英文名称"></el-input>
      </el-form-item>
      <el-form-item label="中文名称:" prop="alias">
        <el-input v-model="form.alias" placeholder="请输入物种中文名称"></el-input>
      </el-form-item>
      <el-form-item label="taxid:" prop="taxid">
        <el-input v-model="form.taxid" placeholder="请输入物种taxid"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="close()">取消</el-button>
        <el-button type="primary" @click="submit" :loading="submitting">保存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<script>
import {createSpecies, updateSpecies} from "@/request/modules/species";

export default {
  emits: ['success'],
  data () {
    return {
      id: 0,
      visible: false,
      form: {
        name: '',
        alias: '',
        taxid: ''
      },
      rules: {
        name: [
          { required: true, message: '请输入物种英文名称', trigger: 'blur' }
        ],
        alias: [
          { required: true, message: '请输入物种中文名称', trigger: 'blur' }
        ],
        taxid: [
          { required: true, message: '请输入taxid', trigger: 'blur' }
        ]
      },
      submitting: false
    }
  },
  computed: {
    title () {
      return this.id ? '编辑物种信息' : '新建物种信息'
    }
  },
  methods: {
    show (row) {
      const keys = Object.keys(this.form)
      const isEdit = !!(row && row.id)
      this.id = isEdit ? row.id : 0
      keys.map(key => {
        this.form[key] = isEdit ? row[key] : ''
      })
      this.visible = true
    },
    close () {
      this.visible = false
    },
    submit () {
      console.log(this.form)
      const request = this.id ? updateSpecies : createSpecies
      const data = this.id ? { ...this.form, id: this.id } : this.form
      this.submitting = true
      request(data).then(resp => {
        console.log(resp)
        this.submitting = false
        this.close()
        this.$emit('success')
      }).catch(() => {
        this.submitting = false
      })
    }
  }
}
</script>
