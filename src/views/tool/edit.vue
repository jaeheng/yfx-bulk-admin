<template>
  <bread-crumb />
  <el-card :header="'工具信息编辑: ' + tool_key" shadow="hover" class="tool-edit">
    <el-row :gutter="20">
      <el-col :span="16">
        <el-form :model="form" :rules="rules" label-width="120px" label-position="left" v-loading="loading" ref="form">
          <el-form-item label="是否显示" prop="show">
            <el-radio-group v-model="form.show">
              <el-radio :label="0">不显示</el-radio>
              <el-radio :label="1">显示</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工具名称" prop="tool_name">
                <el-input v-model="form.tool_name" placeholder="工具名称"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文工具名称" prop="en_tool_name">
                <el-input v-model="form.en_tool_name" placeholder="工具英文名称"></el-input>
              </el-form-item>
            </el-col>
          </el-row>
          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="工具介绍" prop="desc">
                <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文工具介绍" prop="en_desc">
                <el-input v-model="form.en_desc" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="注意事项" prop="notice">
                <el-input v-model="form.notice" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文注意事项" prop="en_notice">
                <el-input v-model="form.en_notice" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="参考引用" prop="reference">
                <el-input v-model="form.reference" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文参考引用" prop="en_reference">
                <el-input v-model="form.en_reference" type="textarea" :autosize="{ minRows: 3 }"></el-input>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="方法描述" prop="method_desc">
                <editor v-model="form.method_desc" ref="methodDescEditor"></editor>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文方法描述" prop="en_method_desc">
                <editor v-model="form.en_method_desc" ref="enMethodDescEditor"></editor>
              </el-form-item>
            </el-col>
          </el-row>

          <el-row :gutter="20">
            <el-col :span="12">
              <el-form-item label="结果说明" prop="caption">
                <editor v-model="form.caption" ref="captionEditor"></editor>
              </el-form-item>
            </el-col>
            <el-col :span="12">
              <el-form-item label="英文结果说明" prop="en_caption">
                <editor v-model="form.en_caption" ref="enCaptionEditor"></editor>
              </el-form-item>
            </el-col>
          </el-row>


          <el-form-item label="物种相关" prop="species_related">
            <el-radio-group v-model="form.species_related">
              <el-radio :label="0">不相关</el-radio>
              <el-radio :label="1">相关</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="选择数限制">
            <el-row>
              <el-col :span="11">
                <el-input type="number" v-model="form.min"></el-input>
              </el-col>
              <el-col :span="2" style="text-align: center">-</el-col>
              <el-col :span="11">
                <el-input type="number" v-model="form.max"></el-input>
              </el-col>
            </el-row>
            <span class="form-item-tip">0为不限制</span>
          </el-form-item>
          <el-form-item label="小图标提示">
            <el-radio-group v-model="form.badge">
              <el-radio :label="item" v-for="item in badge" :key="item">
                <i class="iconfont" :class="item" style="font-size: 28px;" v-if="badge"></i>
                <span v-else>无</span>
              </el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="小图标颜色">
            <el-color-picker v-model="form.badge_color"></el-color-picker>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="submit" :loading="submitting">保存</el-button>
          </el-form-item>
        </el-form>
      </el-col>
      <el-col :span="8">
        <div style="text-align: center">
          <h3>图标设置</h3>
          <img :src="img" style="border: 5px solid #ddd;margin-bottom: 15px;padding: 5px;">
          <el-upload
            class="upload-demo"
            drag
            :before-upload="beforeUpload"
            :on-success="success"
            v-loading="uploading"
            :data="{ id: $route.query.id, platform }"
            :headers="{ Authorization: token }"
            :action="api.toolIconUpload">
            <i class="iconfont icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
            <template #tip>
              <div class="el-upload__tip">只能上传{{ ext.join('/') }}文件，且不超过{{ size }}MB</div>
            </template>
          </el-upload>
        </div>
      </el-col>
    </el-row>
  </el-card>
</template>

<script>
import { getSuffix } from '@/libs/functions'
import editor from '_c/editor.vue'
import image from '@img/tool.svg'
import BreadCrumb from "_c/BreadCrumb.vue";
import {getToken} from "../../libs/storage";

export default {
  components: {
    BreadCrumb,
    editor
  },
  data () {
    return {
      image,
      platform: this.$route.query.platform,
      tool_key: '',
      data_type: '',
      img: '',
      badge: ['', 'icon-new', 'icon-tuijian', 'icon-star'],
      form: {
        show: 0,
        min: 0,
        max: 0,
        badge: '',
        badge_color: '',
        species_related: 1,
        tool_name: '',
        desc: '',
        notice: '',
        reference: '',
        method_desc: '',
        caption: '',
        en_tool_name: '',
        en_desc: '',
        en_notice: '',
        en_reference: '',
        en_method_desc: '',
        en_caption: ''
      },
      rules: {
        tool_name: [
          { required: true, message: '请输入工具名称', trigger: 'blur' }
        ],
        en_tool_name: [
          { required: true, message: '请输入工具英文名称', trigger: 'blur' }
        ],
        show: [
          { required: true, message: '请选择是否显示', trigger: 'change' }
        ],
        desc: [
          { required: true, message: '请填写工具介绍', trigger: 'blur' }
        ],
        en_desc: [
          { required: true, message: '请填写工具英文介绍', trigger: 'blur' }
        ]
      },
      loading: false,
      uploading: false,
      submitting: false,
      ext: ['jpg', 'jpeg', 'png', 'svg'],
      size: 1, // MB
      token: getToken()
    }
  },
  methods: {
    fetchData () {
      const id = this.$route.query.id
      const platform = this.platform
      if (id && platform) {
        this.loading = true
        this.$util.get(this.api.toolInfo, { id, platform }, resp => {
          Object.keys(this.form).map(key => {
            this.form[key] = resp[key]
          })
          this.tool_key = resp.tool_key
          this.data_type = resp.data_type
          this.img = resp.img
          this.$refs.methodDescEditor.setDefault(resp.method_desc || '')
          this.$refs.enMethodDescEditor.setDefault(resp.en_method_desc || '')
          this.$refs.captionEditor.setDefault(resp.caption || '')
          this.$refs.enCaptionEditor.setDefault(resp.en_caption || '')
          this.loading = false
        }, () => {
          this.loading = false
        })
      }
    },
    submit () {
      const id = this.$route.query.id
      const platform = this.platform
      this.$refs.form.validate(valid => {
        if (valid) {
          this.submitting = true
          this.$util.post(this.api.toolEdit, { id, ...this.form, platform }, resp => {
            this.$message.success('修改成功')
            this.$router.back()
            this.submitting = false
          }, () => {
            this.submitting = false
          })
        }
      })
    },
    beforeUpload (file) {
      if (file.size > this.size * 1024 * 1024) {
        this.$message.error(`上传图片不可大于${this.size}MB`)
        return false
      }
      const ext = this.ext
      if (!ext.includes(getSuffix(file.name))) {
        this.$message.error('后缀应为' + ext.join(','))
        return false
      }
      this.uploading = true
      return true
    },
    success (resp, file) {
      this.uploading = false
      if (resp.code === 200) {
        this.img = URL.createObjectURL(file.raw)
        this.$message.success(resp.message)
      } else {
        this.$message.error(resp.message)
      }
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
