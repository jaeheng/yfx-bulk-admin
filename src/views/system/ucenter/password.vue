<template>
    <page-header description="管理员修改自己的项目密码" :image="image"></page-header>
    <el-card shadow="hover">
        <el-form label-width="100px" :model="form" ref="form" :rules="rules" style="padding-top: 20px;">
            <el-form-item label="旧密码" prop="old_password">
                <el-input placeholder="请输入旧密码" type="password" v-model="form.old_password" show-password/>
            </el-form-item>
            <el-form-item label="新密码" prop="password">
                <el-input placeholder="请输入新密码" type="password" v-model="form.password" show-password/>
            </el-form-item>
            <el-form-item label="确认密码" prop="password_confirmation">
                <el-input placeholder="请输入确认密码" type="password" v-model="form.password_confirmation"
                          show-password/>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" :loading="submitting" @click="submitHandle">确认修改</el-button>
            </el-form-item>
        </el-form>
    </el-card>
</template>

<script>
import image from '@img/user.png'
import PageHeader from "_c/PageHeader.vue";

export default {
    components: {PageHeader},
    data() {
        let rePwdCheck = (rule, value, callback) => {
            if (value !== this.form.password) {
                callback(new Error('确认密码与新密码不一致!'))
            } else {
                callback()
            }
        }
        return {
            image,
            form: {
                old_password: '',
                password: '',
                password_confirmation: ''
            },
            rules: {
                old_password: [
                    {required: true, message: '请输入旧密码', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入新密码', trigger: 'blur'}
                ],
                password_confirmation: [
                    {required: true, message: '请输入确认密码', trigger: 'blur'},
                    {validator: rePwdCheck, trigger: 'blur'}
                ]
            },
            submitting: false
        }
    },
    methods: {
        submitHandle() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let form = this.form
                    this.submitting = true
                    this.$util.post(this.api.password, form, resp => {
                        this.submitting = false
                        this.$message.success('修改密码成功')
                        this.$router.push('/')
                    }, () => {
                        this.submitting = false
                    })
                }
            })
        }
    }
}
</script>
