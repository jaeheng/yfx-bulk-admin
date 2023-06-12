<template>
  <page-header description="管理员修改自己的个人信息" :image="image"></page-header>
  <el-card class="container" shadow="never">
    <el-form label-width="100px" :model="form" ref="form" :rules="rules" style="padding-top: 20px;" v-loading="loading">
      <el-form-item label="账号" prop="username">
        {{ userInfo.username }}
      </el-form-item>
      <el-form-item label="昵称" prop="username">
        <el-input placeholder="请输入昵称" v-model="form.username" />
      </el-form-item>
      <el-form-item >
        <el-button type="primary" :loading="submitting" @click="submitHandle">确认修改</el-button>
      </el-form-item>
    </el-form>
  </el-card>
</template>

<script>
import {mapGetters} from 'vuex'
import {editUserInfo, getUserInfo} from "@/request/modules/user";
import image from '@img/user.png'
import PageHeader from "_c/PageHeader.vue";

export default {
  components: {PageHeader},
  data () {
    return {
      form: {
        username: ''
      },
      rules: {
        username: [
          { required: true, message: '请输入昵称', trigger: 'blur' }
        ]
      },
      submitting: false,
      loading: false,
      image
    }
  },
  computed: {
    ...mapGetters({
      userInfo: 'user/userInfo'
    })
  },
  methods: {
    submitHandle () {
      this.$refs.form.validate(valid => {
        if (valid) {
          let form = this.form
          this.submitting = true
          editUserInfo(form).then(resp => {
            this.submitting = false
            this.$message.success('修改成功!')
          }).catch(() => {
            this.submitting = false
          })
        }
      })
    },
    getUserInfo () {
      this.loading = true
      getUserInfo({}).then(resp => {
        this.form.username = resp.username
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    }
  },
  created() {
    this.getUserInfo()
  }
}
</script>
