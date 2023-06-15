<template>
    <div class="projects-list">
        <page-header description="管理已删除项目账号信息" :image="image"></page-header>
        <el-card style="margin: 15px 0;" shadow="hover">
            <el-form>
                <el-row :gutter="15">
                    <el-col :span="6">
                        <el-form-item label="所属公司:">
                            <el-select v-model="form.company_id" v-loading="companyLoading" class="full-width">
                                <el-option :value="0" label="所有"></el-option>
                                <el-option :value="item.value" :label="item.label" v-for="item in company"
                                           :key="item.value"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="平台">
                            <el-select v-model="form.user_type" class="full-width">
                                <el-option value="all" label="所有平台"></el-option>
                                <el-option :value="SINGLE_CELL_DATA" label="单细胞"></el-option>
                                <el-option :value="SPATIAL_DATA" label="空间"></el-option>
                            </el-select>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item label="关键字:">
                            <el-input class="search" v-model="form.keyword" @keyup.enter="search"
                                      placeholder="请输入关键字搜索"/>
                        </el-form-item>
                    </el-col>
                    <el-col :span="6">
                        <el-form-item>
                            <el-button type="primary" @click="search">搜索</el-button>
                        </el-form-item>
                    </el-col>
                </el-row>
            </el-form>
        </el-card>
        <el-card header="项目列表" shadow="hover">
            <el-table :data="tableData" v-loading="loading" row-key="id">
                <el-table-column label="ID" prop="id" width="120"/>
                <el-table-column label="项目编号" prop="project"/>
                <el-table-column label="所属公司" prop="company.company_name"></el-table-column>
                <el-table-column label="任务数" prop="task_count"/>
                <el-table-column label="平台">
                    <template #default="scope">
                        {{ platformText[scope.row.user_type] }}
                    </template>
                </el-table-column>
                <el-table-column label="样本数">
                    <template #default="scope">
                        {{ scope.row.sample_count }}
                    </template>
                </el-table-column>
                <el-table-column label="确认删除">
                    <template #default="scope">
                        <el-tag v-if="scope.row.is_deleted" type="warning">已确认</el-tag>
                        <el-tag v-else type="info">未确认</el-tag>
                    </template>
                </el-table-column>
                <el-table-column label="创建时间" prop="created_at"/>
                <el-table-column label="删除时间" prop="deleted_at"/>
                <el-table-column label="操作" width="300">
                    <template #default="scope">
                        <confirm-button
                            message="确认要恢复该账号?"
                            confirm-type="warning"
                            type="warning"
                            :params="scope.row.id"
                            :request="recoverUser"
                            success-message="账号已恢复，可以继续使用"
                            :disabled="!!scope.row.is_deleted"
                            @success="fetchData">
                            <el-icon>
                                <RefreshLeft/>
                            </el-icon>
                            恢复
                        </confirm-button>

                        <confirm-button
                            message="确认要将该账号彻底删除?"
                            confirm-type="warning"
                            type="danger"
                            :params="scope.row.id"
                            :request="confirmDeleteUser"
                            success-message="账号已彻底删除，无法恢复，请知悉"
                            @success="fetchData">
                            <el-icon>
                                <DeleteFilled/>
                            </el-icon>
                            确认删除
                        </confirm-button>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                :layout="PAGE_LAYOUT"
                :total="total"
                :hide-on-single-page="true"
                :page-size="perPage"
                v-model:currentPage="page">
            </el-pagination>
        </el-card>
    </div>
</template>

<style lang="scss" scoped>
.projects {
    padding-bottom: 50px;

    .el-form-item--large {
        margin-bottom: 0;
    }
}

.import-log {
    font-size: 13px;
    max-height: 300px;
    overflow-y: auto;
    white-space: pre-wrap;
}
</style>
<style lang="scss">
.import-log {
    span {
        display: inline-block;
        width: 60px;
        text-align: center;
    }
}
</style>

<script>
import {PAGE_LAYOUT, SINGLE_CELL_DATA, SPATIAL_DATA} from '@/config/app'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/project.png'
import {getCompanyList} from "@/request/modules/company"
import ImportState from "_c/ImportState.vue";
import {getDeletedUser, recoverUser, confirmDeleteUser} from "@/request/modules/user";
import {RefreshLeft, DeleteFilled} from "@element-plus/icons-vue";
import ConfirmButton from "_c/ConfirmButton.vue";

export default {
    components: {
        PageHeader,
        ImportState,
        RefreshLeft,
        DeleteFilled,
        ConfirmButton
    },
    watch: {
        page() {
            this.fetchData()
        }
    },
    data() {
        return {
            recoverUser,
            confirmDeleteUser,
            total: 0,
            page: 1,
            now: new Date().getTime() / 1000,
            form: {
                company_id: 0,
                keyword: '',
                user_type: 'all'
            },
            tableData: [],
            company: [],
            perPage: 0,
            PAGE_LAYOUT,
            loading: false,
            companyLoading: false,
            image,
            importState: {
                '-3': '待激活',
                '-2': '等待',
                '-1': '排队',
                '0': '进行',
                '1': '成功',
                '2': '失败'
            },
            SINGLE_CELL_DATA,
            SPATIAL_DATA
        }
    },
    computed: {
        platformText() {
            const text = {}
            text[SINGLE_CELL_DATA] = '单细胞平台'
            text[SPATIAL_DATA] = '空间平台'
            return text
        }
    },
    methods: {
        fetchData() {
            let page = this.page
            this.loading = true
            getDeletedUser({page, ...this.form}).then(resp => {
                this.tableData = resp.list || []
                this.total = resp.total || 0
                this.perPage = resp.perPage || 15
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        },
        /**
         * 搜索
         */
        search() {
            this.currentChange(1)
        },
        /**
         * 翻页
         */
        currentChange(page) {
            this.page = page
            this.fetchData()
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
            }).catch((err) => {
                console.log(err)
                this.companyLoading = false
            })
        }
    },
    mounted() {
        this.getCompanyList()
        this.fetchData()
    }
}
</script>
