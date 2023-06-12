<template>
    <div class="login-page" :style="`background-image: url(${loginBg})`">
        <div class="login-form">
            <el-row style="height: 100%;">
                <el-col :span="8" class="left">
                    <i class="iconfont icon-vip"></i>
                    <h2 class="sub-title">后台管理系统</h2>
                    <span class="version">v{{ version }}</span>
                </el-col>
                <el-col :span="16" class="right">
                    <h1 class="site-name">BULK_RNASeq 后台</h1>
                    <el-form :model="form" :rules="rules" ref="form" class="form" label-position="top">
                        <el-form-item prop="username">
                            <el-input v-model="form.username" placeholder="请输入管理员账号"/>
                        </el-form-item>
                        <el-form-item prop="password">
                            <el-input
                                v-model="form.password"
                                show-password
                                placeholder="请输入管理员密码"
                                @keyup.enter="loginHandle"/>
                        </el-form-item>
                        <el-form-item>
                            <p class="form-item-tip">忘记密码请联系开发人员</p>
                            <el-button type="primary" @click="loginHandle" style="width: 100%;" :loading="submitting">登
                                录
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
    background: #3B4D7F no-repeat;
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
        background: rgba(1, 8, 60, .4);
        backdrop-filter: blur(10px);
        z-index: 1;
    }


    .site-name, .sub-title {
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
    background: rgba(255, 255, 255, .9);
    margin: 0 auto;

    .sub-title {
        font-size: 15px;
        flex: 1;
    }

    .icon-vip {
        font-size: 80px;
        display: block;
        margin-top: 20px;
    }

    .left {
        background: #3672F6;
        text-align: center;
        display: flex;
        flex-direction: column;
        color: rgba(255, 255, 255, .8);
    }

    .left, .right {
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
import {SITE_NAME} from '@/config/app'
import {setToken} from '@/libs/storage'
import loginBg from './login-bg.jpg'
import {APP_VERSION} from "@/config/app";

export default {
    data() {
        return {
            version: APP_VERSION,
            form: {
                username: '',
                password: ''
            },
            rules: {
                username: [
                    {required: true, message: '请输入管理员账号', trigger: 'blur'}
                ],
                password: [
                    {required: true, message: '请输入管理员密码', trigger: 'blur'}
                ]
            },
            submitting: false,
            start: new Date().getDay(),
            end: 6,
            SITE_NAME,
            loginBg
        }
    },
    methods: {
        loginHandle() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let form = this.form
                    this.submitting = true
                    this.$util.post(this.api.sign, form, resp => {
                        this.submitting = false
                        setToken(resp.token_type + ' ' + resp.access_token, resp.expires_in / 60 / 60 / 24)

                        const redirect = this.$route.query.redirect
                        if (redirect) {
                            this.$router.push(redirect)
                        } else {
                            this.$router.push('/dashboard')
                        }
                    }, () => {
                        this.submitting = false
                    })
                }
            })
        }
    },
    mounted() {
        console.log(this.$route)
    }
}
</script>
