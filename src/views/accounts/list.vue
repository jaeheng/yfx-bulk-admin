<template>
    <div class="accounts-list">
        <page-header description="管理项目账号信息" :image="image">
            <router-link to="/accounts/create">
                <el-button type="primary"><i class="iconfont icon-plus"></i> 创建账号</el-button>
            </router-link>
        </page-header>
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
        <el-card header="账号列表" shadow="hover">
            <el-table :data="tableData" v-loading="loading" size="small" row-key="id">
                <el-table-column label="ID" prop="id" width="120"/>
                <el-table-column label="项目编号" prop="project"/>
                <el-table-column label="所属公司" prop="company.company_name"></el-table-column>
                <el-table-column label="物种" prop="species.alias" width="100"/>
                <el-table-column label="注释库" prop="library.name" width="100"/>
                <el-table-column label="任务数" prop="task_count" width="100"/>
                <el-table-column label="样本数" prop="sample_count" width="100"/>
                <el-table-column label="创建时间" prop="created_at" width="220">
                    <template #default="scope">
                        <el-link
                            v-if="scope.row.pid === 0"
                            :underline="false"
                            :title="'截至日期：' + dateFmt(scope.row.due_date)"
                            :type="scope.row.due_date - now > 0 ? 'default' : 'danger'">
                            {{ scope.row.created_at }}
                            {{ scope.row.due_date - now > 0 ? '' : '(已过期)' }}
                        </el-link>
                        <el-link v-else :underline="false">{{ scope.row.created_at }}</el-link>
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="120">
                    <template #default="scope">
                        <router-link :to="{ name: 'accountsEdit', params: { id: scope.row.id } }">
                            <el-button size="small" type="primary" circle plain>
                                <i class="iconfont icon-edit"></i>
                            </el-button>
                        </router-link>

                        <router-link :to="{ name: 'accountsField', params: { id: scope.row.id } }"
                                     style="margin: 0 10px;">
                            <el-button size="small" type="warning" circle plain>
                                <i class="iconfont icon-select"></i>
                            </el-button>
                        </router-link>

                        <more :data="scope.row" style="margin-left: 10px;" @freshData="fetchData"></more>
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
.accounts {
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
        width: 100px;
        text-align: center;
    }
}
</style>

<script>
import {PAGE_LAYOUT} from '@/config/app'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/project.png'
import {getCompanyList} from "@/request/modules/company"
import more from './more.vue'
import {dateFmt} from "@/libs/functions";

export default {
    components: {
        PageHeader,
        more,
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
            image,
        }
    },
    methods: {
        fetchData() {
            let page = this.page
            this.loading = true
            this.$util.get(this.api.project, {page, ...this.form}, resp => {
                this.tableData = resp.list || []
                this.total = resp.total || 0
                this.perPage = resp.perPage || 15
                this.loading = false
            }, () => {
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
            }).catch(() => {
                this.companyLoading = false
            })
        },
        dateFmt(second) {
            return dateFmt(second)
        }
    },
    mounted() {
        this.getCompanyList()
        this.fetchData()
    }
}
</script>
