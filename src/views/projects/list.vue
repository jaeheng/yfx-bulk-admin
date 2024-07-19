<template>
    <div class="projects-list">
        <page-header description="管理项目项目信息" :image="image" :has-bread="false">
            <router-link to="/projects/create">
                <el-button type="primary"><i class="iconfont icon-plus"></i> 创建项目</el-button>
            </router-link>
        </page-header>
        <div class="container">
            <el-card style="margin: 15px 0" shadow="hover" header="条件搜索">
                <el-form label-position="top">
                    <el-form-item label="所属公司:">
                        <el-radio-group v-model="form.company_id">
                            <el-radio :value="0">所有</el-radio>
                            <el-radio :value="item.value" v-for="item in company" :key="item.value"
                                >{{ item.label }}
                            </el-radio>
                        </el-radio-group>
                    </el-form-item>
                    <el-form-item label="关键字:">
                        <el-input
                            class="search"
                            v-model="form.keyword"
                            @keyup.enter="search"
                            placeholder="请输入关键字搜索"
                        />
                    </el-form-item>
                    <el-form-item>
                        <el-button type="primary" @click="search">搜索</el-button>
                    </el-form-item>
                </el-form>
            </el-card>
            <el-card header="项目列表" shadow="hover">
                <el-table :data="tableData" v-loading="loading" row-key="id">
                    <el-table-column label="ID" prop="id" width="120" />
                    <el-table-column label="YFX编号" prop="yfx_id" />
                    <el-table-column label="项目编号" prop="project" />
                    <el-table-column label="所属公司" prop="company.name" />
                    <el-table-column label="任务数" prop="task_count" width="100" />
                    <el-table-column label="样本数" prop="sample_count" width="100" />
                    <el-table-column label="创建时间" prop="created_at" width="220" />
                    <el-table-column label="付费情况">
                        <template #default="scope">
                            <paid-state
                                :due-date="scope.row.due_date"
                                :is-paid="scope.row.is_paid"
                            ></paid-state>
                        </template>
                    </el-table-column>
                    <el-table-column label="操作" width="400">
                        <template #default="scope">
                            <router-link
                                :to="{ name: 'projectsEdit', params: { id: scope.row.id } }"
                            >
                                <el-button type="primary" plain>
                                    <i class="iconfont icon-edit"></i> 编辑
                                </el-button>
                            </router-link>
                            <router-link
                                :to="{ name: 'projectsImport', params: { id: scope.row.id } }"
                                style="margin: 0 10px"
                            >
                                <el-button type="primary" plain @click="visible = true">
                                    <i class="iconfont icon-import"></i> 导入
                                </el-button>
                            </router-link>

                            <more :data="scope.row" @freshData="fetchData"></more>
                        </template>
                    </el-table-column>
                </el-table>

                <el-pagination
                    background
                    :layout="PAGE_LAYOUT"
                    :total="total"
                    :hide-on-single-page="true"
                    :page-size="perPage"
                    v-model:currentPage="page"
                >
                </el-pagination>
            </el-card>
        </div>
    </div>
</template>

<style lang="scss" scoped>
.projects {
    padding-bottom: 50px;

    .el-form-item--large {
        margin-bottom: 0;
    }
}
</style>

<script>
import { PAGE_LAYOUT } from '@/config/app'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/project.png'
import { getCompanyList } from '@/request/modules/company'
import more from './more.vue'
import PaidState from '_c/PaidState.vue'

export default {
    components: {
        PageHeader,
        more,
        PaidState
    },
    watch: {
        page() {
            this.fetchData()
        }
    },
    data() {
        return {
            total: 0,
            page: 1,
            now: new Date().getTime() / 1000,
            form: {
                company_id: 0,
                keyword: ''
            },
            tableData: [],
            company: [],
            perPage: 0,
            PAGE_LAYOUT,
            loading: false,
            companyLoading: false,
            image
        }
    },
    methods: {
        fetchData() {
            let page = this.page
            this.loading = true
            this.$util.get(
                this.api.project,
                { page, ...this.form },
                (resp) => {
                    this.tableData = resp.list || []
                    this.total = resp.total || 0
                    this.perPage = resp.perPage || 15
                    this.loading = false
                },
                () => {
                    this.loading = false
                }
            )
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
            getCompanyList({})
                .then((resp) => {
                    this.company = resp.map((item) => {
                        return {
                            label: item.name,
                            value: item.id
                        }
                    })
                    this.companyLoading = false
                })
                .catch(() => {
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
