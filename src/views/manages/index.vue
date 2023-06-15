<template>
    <div class="projects">
        <page-header description="管理项目账号信息" :image="image"/>
        <el-card style="margin: 15px 0;" shadow="hover">
            <el-form inline>
                <el-form-item style="margin-bottom: 0;">
                    <el-button type="primary" @click="showDialog(false)"><i class="iconfont icon-plus"></i> 创建账号
                    </el-button>
                </el-form-item>
                <el-form-item label="所属公司:" style="margin-bottom: 0;">
                    <el-select v-model="form.company_id" v-loading="companyLoading" class="full-width">
                        <el-option :value="0" label="所有"></el-option>
                        <el-option :value="item.value" :label="item.label" v-for="item in company"
                                   :key="item.value"></el-option>
                    </el-select>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card header="项目列表" shadow="hover">
            <el-table :data="tableList" v-loading="loading">
                <el-table-column label="ID" prop="id" width="120"/>
                <el-table-column label="所属公司" prop="company.company_name"></el-table-column>
                <el-table-column label="账号" prop="account"/>
                <el-table-column label="创建时间" prop="created_at"/>
                <el-table-column label="账号状态" prop="status">
                    <template #default="scope">
                        <!-- 0已禁用 1可用 -->
                        <div>
                            <import-state :state="scope.row.status">{{
                                    scope.row.status === 1 ? '可用' : '已禁用'
                                }}
                            </import-state>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="200">
                    <template #default="scope">
                        <el-button size="small" type="primary" circle plain @click="showDialog(scope.row)">
                            <i class="iconfont icon-edit"></i>
                        </el-button>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>

        <el-dialog v-model="visible" :title="(current.id ? '编辑' : '创建') + '项目账号信息'">
            <el-form :model="createForm" :rules="rules" label-position="left" label-width="120px" ref="form">
                <el-form-item label="账号" prop="account">
                    <el-input v-model="createForm.account" autocomplete="off" placeholder="请输入账号"/>
                </el-form-item>
                <el-form-item label="密码" prop="password">
                    <el-input v-model="createForm.password" autocomplete="off" placeholder="请输入密码"/>
                </el-form-item>
                <el-form-item label="公司" prop="company_id">
                    <el-select v-model="createForm.company_id" placeholder="账号所属公司">
                        <el-option :label="item.label" :value="item.value" v-for="item in company"/>
                    </el-select>
                </el-form-item>
                <el-form-item label="状态" prop="company_id">
                    <el-radio-group v-model="createForm.status">
                        <el-radio :label="1">可用</el-radio>
                        <el-radio :label="0">禁用</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
            <template #footer>
      <span class="dialog-footer">
        <el-button @click="visible = false">取 消</el-button>
        <el-button type="primary" @click="submitHandler" :loading="submitting">保 存</el-button>
      </span>
            </template>
        </el-dialog>
    </div>
</template>

<style lang="scss" scoped>
.projects {
    padding-bottom: 50px;
}

.import-log {
    font-size: 13px;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
}
</style>

<script>
import PageHeader from '_c/PageHeader.vue'
import image from '@img/project.png'
import {getCompanyList} from "@/request/modules/company"
import {createManage, getManageList, updateManage} from "@/request/modules/manage";
import ImportState from "_c/ImportState.vue";

export default {
    components: {
        PageHeader,
        ImportState
    },
    data() {
        return {
            total: 0,
            page: 1,
            form: {
                perPage: 15,
                company_id: 0
            },
            createForm: {
                company_id: '',
                account: '',
                password: '',
                status: 1
            },
            rules: {
                company_id: [
                    {required: true, message: '公司必选', trigger: 'change'}
                ],
                account: [
                    {required: true, message: '账号必填', trigger: 'blur'}
                ],
                password: [],
                status: []
            },
            tableData: [],
            company: [],
            loading: false,
            companyLoading: false,
            visible: false,
            image,
            current: {},
            submitting: false
        }
    },
    computed: {
        tableList() {
            return this.tableData.filter(item => {
                return this.form.company_id ? item.company_id === this.form.company_id : true
            })
        }
    },
    methods: {
        fetchData() {
            const page = this.page
            const pageSize = this.form.perPage
            this.loading = true
            getManageList({page, pageSize}).then(resp => {
                this.tableData = resp
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        getCompanyList() {
            this.companyLoading = true
            getCompanyList({}).then(resp => {
                this.company = resp.map(item => {
                    return {
                        label: item.company_name,
                        value: item.id
                    }
                })
                this.companyLoading = false
            }).catch(() => {
                this.companyLoading = false
            })
        },
        showDialog(row) {
            if (row) {
                this.createForm = {
                    company_id: row.company_id,
                    account: row.account,
                    password: '',
                    status: row.status
                }
                this.current = row
            } else {
                this.createForm = {
                    company_id: 0,
                    account: '',
                    password: '',
                    status: 1
                }
                this.current = {}
            }
            this.visible = true
        },
        submitHandler() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true
                    if (this.current.id) {
                        updateManage(this.createForm, this.current.id).then(resp => {
                            console.log('成功')
                            this.$message.success('修改成功')
                            this.submitting = false
                            this.visible = false
                            this.fetchData()
                        }).catch(() => {
                            this.submitting = false
                        })
                    } else {
                        createManage(this.createForm).then(resp => {
                            this.$message.success('创建成功')
                            this.submitting = false
                            this.visible = false
                            this.fetchData()
                        }).catch(() => {
                            this.submitting = false
                        })
                    }
                }
            })
        }
    },
    mounted() {
        this.getCompanyList()
        this.fetchData()
    }
}
</script>
