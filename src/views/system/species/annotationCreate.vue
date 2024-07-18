<template>
  <el-dialog v-model="visible" :title="title">
    <el-form :model="form" label-position="left" label-width="120px" :rules="rules" ref="form">
      <el-form-item label="名称" prop="name">
        <el-input v-model="form.name" placeholder="请输入注释库名称" />
      </el-form-item>
      <el-form-item label="描述" prop="description">
        <el-input type="textarea" v-model="form.description" placeholder="请输入注释库描述" />
      </el-form-item>
      <el-form-item label="维护者" prop="maintainer">
        <el-input v-model="form.maintainer" placeholder="请输入维护者联系方式" />
      </el-form-item>
      <el-form-item label="包含的工具" prop="tool">
        <div style="line-height: 1">
          <el-checkbox-group v-model="form.tool">
            <el-checkbox v-for="item in tools" :key="item.id" :label="item.id"
              >{{ item.tool_name }}
            </el-checkbox>
          </el-checkbox-group>
        </div>
      </el-form-item>
      <el-form-item label="包含的内容">
        <el-checkbox-group v-model="require" @change="requireChange">
          <el-checkbox v-for="item in requirements" :key="item" :label="item"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item>
        <div style="width: 100%">
          <el-row :gutter="10" v-for="item in Object.keys(form.require)">
            <el-col :span="6">{{ item }}</el-col>
            <el-col :span="18">
              <el-input v-model="form.require[item]" placeholder="版本号" size="small"></el-input>
            </el-col>
          </el-row>
        </div>
      </el-form-item>
      <el-form-item label="公共基因集">
        <el-row :gutter="10" style="width: 100%">
          <el-col :span="6">
            <el-input v-model="public.name" placeholder="公共数据库"></el-input>
          </el-col>
          <el-col :span="12">
            <el-input v-model="public.version" placeholder="相对路径,如GO/CC.txt"></el-input>
          </el-col>
          <el-col :span="6">
            <el-button type="primary" @click="add" style="width: 100%">添加</el-button>
          </el-col>
        </el-row>
      </el-form-item>
      <el-form-item>
        <ul class="public-genesets">
          <li>{</li>
          <li class="with-padding" v-for="(value, key) of form.public">
            <span>"{{ key }}": "{{ value }}"</span>
            <span class="btn" @click="deletePublic(key)">删除</span>
          </li>
          <li>}</li>
        </ul>
      </el-form-item>
      <el-form-item>
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submit" :loading="submitting">保 存</el-button>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>
<style lang="scss">
.public-genesets {
  border-radius: 4px;
  line-height: 1.5;
  list-style: none;
  background: #f3f3f3;
  width: 100%;
  box-sizing: border-box;
  padding: 10px;

  li {
    display: flex;
    justify-content: space-between;

    &.with-padding {
      padding: 0 2em;
    }

    &:hover {
      background: #eee;
    }

    .btn {
      color: #2b73e5;
      cursor: pointer;
    }
  }
}
</style>
<script>
import {
  ANNOTATION_REQUIRES,
  DEFAULT_MAINTAINER,
  SINGLE_CELL_DATA,
  SPATIAL_DATA
} from '@/config/app'
import { getToolList } from '@/request/modules/tool'
import { createAnnotation, updateAnnotation } from '@/request/modules/species'
import _ from 'lodash-es'

export default {
  emits: ['success'],
  data() {
    return {
      id: 0,
      DEFAULT_MAINTAINER,
      form: {
        name: '',
        description: '',
        maintainer: DEFAULT_MAINTAINER,
        tool: [],
        require: {},
        public: {}
      },
      rules: {
        name: [{ required: true, message: '请填写名称', trigger: 'blur' }],
        description: [{ required: true, message: '请填写描述', trigger: 'blur' }],
        maintainer: [{ required: true, message: '请填写维护者', trigger: 'blur' }],
        tool: [{ type: 'array', message: '请至少选择一个可用的工具', trigger: 'change' }]
      },
      visible: false,
      require: [],
      requirements: ANNOTATION_REQUIRES,
      tools: [],
      public: { name: '', version: '' },
      submitting: false,
      species_id: 0
    }
  },
  computed: {
    isEdit() {
      return !!this.id
    },
    title() {
      return !!this.id ? '编辑注释库' : '新建注释库'
    }
  },
  methods: {
    show(species_id, row) {
      const keys = Object.keys(this.form)
      this.species_id = species_id
      this.public.name = ''
      this.public.version = ''
      if (row) {
        keys.map((key) => {
          if (key === 'tool' && !row[key]) {
            row[key] = []
          }
          this.form[key] = row[key]
        })
        this.id = row.id
        if (Object.keys(row.require).length > 0) {
          this.require = Object.keys(row.require)
        }
      } else {
        this.form = {
          name: '',
          description: '',
          maintainer: DEFAULT_MAINTAINER,
          require: [],
          tool: [],
          public: {}
        }
        this.require = []
        this.id = 0
      }
      this.visible = true
      this.fetchTools(SINGLE_CELL_DATA)
      this.fetchTools(SPATIAL_DATA)
    },
    requireChange() {
      const selected = this.require
      const formRequire = this.form.require
      const obj = {}
      selected.map((key) => {
        obj[key] = formRequire[key] || ''
      })
      this.form.require = obj
    },
    fetchTools(platform) {
      this.loadingTools = true
      getToolList({ platform })
        .then((resp) => {
          this.tools = resp.filter((item) => {
            return item.is_species_related === 'T'
          })
          this.loadingTools = false
        })
        .catch(() => {
          this.loadingTools = false
        })
    },
    add() {
      if (this.form.public instanceof Array) {
        this.form.public = {}
      }
      this.form.public[this.public.name] = this.public.version
    },
    deletePublic(key) {
      delete this.form.public[key]
    },
    submit() {
      this.form.require = this.filterRequire(this.form.require)
      this.form.tool = _.uniq(this.form.tool).filter((item) => {
        return this.tools.map((item) => item.id).includes(item)
      })
      const data = this.id
        ? { ...this.form, id: this.id, species_id: this.species_id }
        : {
            ...this.form,
            species_id: this.species_id
          }
      const request = this.id ? updateAnnotation : createAnnotation
      this.$refs.form.validate((valid) => {
        if (valid) {
          this.submitting = true
          request(data)
            .then((resp) => {
              this.$message.success('保存成功!')
              this.submitting = false
              this.visible = false
              this.$emit('success')
            })
            .catch(() => {
              this.submitting = false
            })
        } else {
          console.log(data)
        }
      })
    },
    filterRequire(obj) {
      if (obj.toString && obj.toString() === '[object Object]') {
        return obj
      } else {
        return {}
      }
    }
  }
}
</script>
