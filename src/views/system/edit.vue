<template>
    <page-header description="管理员修改自己的个人信息" :image="image"></page-header>
    <el-card class="border-less" shadow="never">
        <el-form
            label-width="100px"
            :model="form"
            ref="form"
            :rules="rules"
            style="padding-top: 20px"
            v-loading="loading"
        >
            <el-form-item label="管理员账号" prop="username">
                {{ userInfo.username }}
            </el-form-item>
            <el-form-item label="管理员昵称" prop="name">
                <el-input placeholder="请输入昵称" v-model="form.name" />
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="submitting" @click="submitHandle"
                    >确认修改
                </el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import { mapGetters } from 'vuex'
import { editUserInfo, getUserInfo } from '@/request/modules/project'
import image from '@img/user.png'
import PageHeader from '_c/PageHeader.vue'

export default {
    components: { PageHeader },
    data() {
        return {
            form: {
                name: ''
            },
            rules: {
                name: [{ required: true, message: '请输入昵称', trigger: 'blur' }]
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
        submitHandle() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.submitting = true
                    editUserInfo(form)
                        .then(() => {
                            this.submitting = false
                            this.$message.success('修改成功!')
                        })
                        .catch(() => {
                            this.submitting = false
                        })
                }
            })
        },
        getUserInfo() {
            this.loading = true
            getUserInfo({})
                .then((resp) => {
                    this.form.name = resp.name
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    },
    created() {
        this.getUserInfo()
    }
}
</script>
