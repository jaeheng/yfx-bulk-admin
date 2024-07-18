<template>
    <div class="login-page" :style="`background-image: url(${loginBg})`">
        <div class="login-form">
            <el-row style="height: 100%">
                <el-col :span="8" class="left">
                    <img src="@/assets/images/logo.svg" alt="logo" class="logo" />
                    <h2 class="sub-title">BULK后台管理系统</h2>
                    <span class="version">v{{ version }}</span>
                </el-col>
                <el-col :span="16" class="right">
                    <h1 class="site-name">系统登录</h1>
                    <el-form
                        :model="form"
                        :rules="rules"
                        ref="form"
                        class="form"
                        label-position="top"
                    >
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="请输入管理员账号" />
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="form.password"
                                show-password
                                placeholder="请输入管理员密码"
                                @keyup.enter="loginHandle"
                            />
                        </el-form-item>
                        <el-form-item>
                            <p class="form-item-tip">忘记密码请联系开发人员</p>
                            <el-button
                                type="primary"
                                @click="loginHandle"
                                style="width: 100%"
                                :loading="submitting"
                                >登 录
                            </el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style lang="scss">
.login-page {
    position: relative;
    height: 100%;
    box-sizing: border-box;
    background: #e6e6e6 no-repeat 100%;
    background-size: cover;
    display: flex;
    align-items: center;

    &:after {
        content: '';
        display: block;
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        z-index: 1;
        background: linear-gradient(to top, rgba(19, 19, 19, 0.54), rgba(255, 255, 255, 0.5));
        backdrop-filter: blur(5px);
    }

    .site-name,
    .sub-title {
        text-align: center;
    }

    .site-name {
        font-size: 22px;
    }
}

.login-form {
    position: relative;
    z-index: 2;
    width: 650px;
    background: #fff;
    margin: 0 auto;

    .sub-title {
        font-size: 14px;
    }

    .version {
        font-size: 12px;
        color: #ccc;
    }

    .logo {
        width: 60px;
        display: block;
        margin: 0 auto;
    }

    .left {
        background: #f9f9f9;
        text-align: center;
        display: flex;
        flex-direction: column;
        justify-content: center;
        color: rgba(0, 0, 0, 0.8);
    }

    .left,
    .right {
        padding-top: 50px;
        padding-bottom: 50px;
        box-sizing: border-box;
    }

    .right {
        padding-left: 50px;
        padding-right: 50px;
    }
}
</style>

<script>
import { setToken } from '@/libs/storage'
import loginBg from './login-bg.jpg'
import { APP_VERSION } from '@/config/app'

export default {
    data() {
        return {
            version: APP_VERSION,
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [{ required: true, message: '请输入管理员账号', trigger: 'blur' }],
                password: [{ required: true, message: '请输入管理员密码', trigger: 'blur' }]
            },
            submitting: false,
            start: new Date().getDay(),
            end: 6,
            loginBg
        }
    },
    methods: {
        loginHandle() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    let form = this.form
                    this.submitting = true
                    this.$util.post(
                        this.api.sign,
                        form,
                        (resp) => {
                            this.submitting = false
                            setToken(
                                resp.token_type + ' ' + resp.access_token,
                                resp.expires_in / 60 / 60 / 24
                            )

                            const redirect = this.$route.query.redirect
                            if (redirect) {
                                this.$router.push(redirect)
                            } else {
                                this.$router.push('/dashboard')
                            }
                        },
                        () => {
                            this.submitting = false
                        }
                    )
                }
            })
        }
    },
    mounted() {
        console.log(this.$route)
    }
}
</script>
