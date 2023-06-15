<template>
    <div class="company">
        <PageHeader :has-bread="true" description="公司信息管理,包括公司公司名称、联系人信息、付费情况等配置"
                    :image="image">
            <el-button type="primary" @click="create">新建公司信息</el-button>
        </PageHeader>

        <div class="container">
            <el-table :data="list" v-loading="loading" border>
                <el-table-column label="公司logo" width="200px">
                    <template #default="scope">
                        <div class="avatar-uploader" @click="openUpload(scope.row, 'logo')">
                            <img v-if="scope.row.logo" :src="scope.row.logo" class="avatar">
                            <i v-else class="iconfont icon-plus avatar-uploader-icon"></i>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="公司名称" prop="name">
                    <template #default="scope">
                        <h3>{{ scope.row.name }}</h3>
                        <p style="font-size: 12px;color: #999;">{{ scope.row.description || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="付费情况">
                    <template #default="scope">
                        <template v-if="scope.row.is_paid === 'T'">
                            <el-tag size="small" type="success">已付费</el-tag>
                            服务期限: {{ scope.row.due_date || '-' }}
                        </template>
                        <template v-else>未付费</template>
                    </template>
                </el-table-column>
                <el-table-column label="联系人">
                    <template #default="scope">
                        姓名: {{ scope.row.contact_name || '-' }}
                        <p>邮箱: {{ scope.row.contact_email || '-' }}</p>
                    </template>
                </el-table-column>
                <el-table-column label="项目数" prop="project_count" sortable></el-table-column>
                <el-table-column label="创建时间" prop="created_at" sortable></el-table-column>
                <el-table-column label="状态">
                    <template #default="scope">
                        <el-tag size="small" type="danger" v-if="scope.row.state === 0">已禁用</el-tag>
                        <el-tag size="small" type="success" v-else>正常</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="操作">
                    <template #default="scope">
                        <el-button type="primary" @click="edit(scope.row)">编辑</el-button>
                        <el-button type="primary" plain @click="$alert(scope.row.remark)">查看备注</el-button>
                    </template>
                </el-table-column>
            </el-table>
        </div>

        <el-drawer
            :title="drawerTitle"
            v-model="drawer"
            :close-on-click-modal="false"
            direction="rtl"
            size="70%"
        >
            <div style="padding: 25px 40px;">
                <el-form :model="form" :rules="rules" label-position="top">
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="名称:" prop="name">
                                <el-input v-model="form.name" placeholder="请输入公司名称"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="状态:" prop="state">
                                <el-radio-group v-model="form.state">
                                    <el-radio :label="1">可用</el-radio>
                                    <el-radio :label="0">禁用</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="联系人邮箱:" prop="contact_email">
                                <el-input v-model="form.contact_email" type="email"
                                          placeholder="请输入公司联系人邮箱"></el-input>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="联系人姓名:" prop="contact_name">
                                <el-input v-model="form.contact_name" placeholder="请输入公司联系人姓名"></el-input>
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-row :gutter="10">
                        <el-col :span="12">
                            <el-form-item label="是否付费:" prop="is_paid">
                                <el-radio-group v-model="form.is_paid">
                                    <el-radio label="F">否</el-radio>
                                    <el-radio label="T">是</el-radio>
                                </el-radio-group>
                            </el-form-item>
                        </el-col>
                        <el-col :span="12">
                            <el-form-item label="服务截止时间:" prop="due_date">
                                <el-date-picker
                                    v-model="form.due_date"
                                    type="date"
                                    placeholder="请输入服务截止时间"
                                    format="YYYY/MM/DD"
                                    value-format="YYYY-MM-DD"
                                />
                            </el-form-item>
                        </el-col>
                    </el-row>
                    <el-form-item label="公司介绍:">
                        <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="form.description"
                                  placeholder="请输入公司介绍"></el-input>
                    </el-form-item>
                    <el-form-item label="备注:">
                        <el-input type="textarea" :autosize="{ minRows: 5 }" v-model="form.remark"
                                  placeholder="请输入备注"></el-input>
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="submit" :loading="submitting">提交</el-button>
                        <el-button @click="close">关闭</el-button>
                    </el-form-item>
                </el-form>
            </div>
        </el-drawer>

        <el-dialog
            title="上传Logo"
            v-model="dialogVisible"
            width="40%">
            <div style="text-align: center">
                <el-upload
                    class="upload-demo"
                    drag
                    :on-error="uploadError"
                    :on-success="uploadSuccess"
                    :accept="allowText"
                    :data="{ id: current, type }"
                    :headers="{ Authorization: token }"
                    :action="api.companyUpload">
                    <i class="iconfont icon-upload"></i>
                    <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                    <template #tip>
                        <div class="el-upload__tip">
                            只能上传{{ allow.join('/') }}文件，且不超过{{ allowSize }}MB
                        </div>
                    </template>
                </el-upload>
            </div>
        </el-dialog>
    </div>
</template>

<style lang="scss">
.company {
    padding-left: 0;
    list-style-type: none;

    .item-title {
        text-align: center;
        line-height: 1.5;
        font-size: 12px;
        color: #787878;
    }

    .avatar-uploader {
        border-radius: 6px;
        cursor: pointer;
        position: relative;
        overflow: hidden;
        text-align: center;
        height: 60px;
        width: 120px;
        box-sizing: border-box;
        background: #FFF;
        color: #1d42ab;
        padding: 15px;
        border: 1px solid #eee;

        &.h {
            margin-right: 0;
        }

        img {
            height: 100%;
        }
    }

    .avatar-uploader:hover {
        border-color: #409EFF;
    }

    .avatar-uploader-icon {
        font-size: 28px;
        width: 60px;
        height: 30px;
        line-height: 30px;
        text-align: center;
    }

    .iconfont.clickable {
        cursor: pointer;
    }
}
</style>

<script>
import check from './check.vue'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/company.png'
import {getToken} from "@/libs/storage";
import {dayjs} from "element-plus";

export default {
    components: {
        check,
        PageHeader
    },
    data() {
        return {
            image,
            loading: true,
            drawer: false,
            dialogVisible: false,
            list: [],
            form: {
                id: '',
                name: '',
                remark: '',
                description: '',
                contact_email: '',
                contact_name: '',
                is_paid: 'F',
                due_date: '',
                state: 1
            },
            rules: {
                name: [
                    {required: true, message: '请填写公司名称', trigger: 'blur'}
                ],
                is_paid: [
                    {required: true, message: '请选择公司付费状态', trigger: 'blur'}
                ],
                contact_email: [
                    {type: 'email', message: '请输入正确的email', trigger: 'blur'}
                ],
                remark: [],
                description: [],
                state: [
                    {required: true, message: '请选择状态', trigger: 'change'}
                ]
            },
            submitting: false,
            current: 0,
            type: '',
            allow: ['jpg', 'jpeg', 'png', 'svg'],
            allowSize: 2, // MB
            token: getToken()
        }
    },
    computed: {
        drawerTitle() {
            return this.form.id ? '编辑公司信息' : '新建公司信息'
        },
        isEdit() {
            return !!this.form.id
        },
        allowText() {
            return this.allow.map(item => {
                return '.' + item
            }).join(',')
        }
    },
    methods: {
        close() {
            this.drawer = false
        },
        create() {
            this.form = {
                id: '',
                name: '',
                remark: '',
                description: '',
                contact_email: '',
                contact_name: '',
                is_paid: 'F',
                due_date: dayjs().add('1', 'year').format('YYYY-MM-DD'),
                state: 1
            }
            this.drawer = true
        },
        edit(row) {
            Object.keys(this.form).map(key => {
                this.form[key] = row[key]
            })
            this.drawer = true
        },
        submit() {
            const api = this.isEdit ? this.api.companyEdit : this.api.companyCreate
            const data = {
                ...this.form
            }
            this.submitting = true
            this.$util.post(api, data, resp => {
                this.$message.success('保存成功')
                this.close()
                this.fetchData()
                this.submitting = false
            }, () => {
                this.submitting = false
            })
        },
        fetchData() {
            this.loading = true
            this.$util.get(this.api.companyList, {}, resp => {
                this.list = resp
                this.loading = false
            }, () => {
                this.loading = false
            })
        },
        openUpload(item, type) {
            this.current = item.id
            this.type = type
            this.dialogVisible = true
        },
        uploadError() {
            this.$message.error('上传错误')
        },
        uploadSuccess(resp) {
            if (resp.code === 200) {
                this.$message.success('上传成功')
                this.dialogVisible = false
                this.fetchData()
            } else {
                this.$message.error(resp.message)
            }
        },
    },
    created() {
        this.fetchData()
    }
}
</script>
