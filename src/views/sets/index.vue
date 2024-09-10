<template>
    <page-header description="查看用户创建的基因集" :image="image" :has-bread="false" />

    <el-card shadow="never" class="border-less" title="按条件搜索">
        <el-form @submit.prevent label-position="left" label-width="120px">
            <el-form-item label="排序字段">
                <el-radio-group v-model="order_key">
                    <el-radio value="">不排序</el-radio>
                    <el-radio value="total">基因数</el-radio>
                    <el-radio value="created_at">创建时间</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="排序方式">
                <el-radio-group v-model="order_value">
                    <el-radio value="desc">降序</el-radio>
                    <el-radio value="asc">升序</el-radio>
                </el-radio-group>
            </el-form-item>
            <el-form-item label="关键字">
                <el-input v-model="keyword"></el-input>
            </el-form-item>
            <el-form-item>
                <el-button type="primary" @click="search" :loading="loading">搜索</el-button>
            </el-form-item>
        </el-form>
    </el-card>
    <el-card shadow="never" class="border-less" style="margin-top: 15px">
        <el-table :data="list" v-loading="loading">
            <el-table-column label="ID" property="id" />
            <el-table-column label="名称" property="name" />
            <el-table-column label="项目编号" property="project.project" />
            <el-table-column label="创建时间" property="created_at" />
            <el-table-column label="基因数" property="total" />
            <el-table-column label="remark" property="remark" />
        </el-table>

        <el-pagination
            background
            :layout="PAGE_LAYOUT"
            :total="total"
            :page-size="perPage"
            v-model:currentPage="page"
            @current-change="currentChange"
        />
    </el-card>
</template>
<script>
import { geneSetList } from '@/request/modules/geneSet'
import { PAGE_LAYOUT } from '@/config/app'
import PageHeader from '_c/PageHeader.vue'
import image from '@/assets/images/genesets.png'

export default {
    components: { PageHeader },
    data() {
        return {
            image,
            PAGE_LAYOUT,
            page: 1,
            total: 0,
            keyword: '',
            project_id: '',
            list: [],
            perPage: 15,
            order_key: '',
            order_value: 'desc',
            loading: false
        }
    },
    methods: {
        search() {
            this.currentChange(1)
        },
        currentChange(page) {
            this.page = page
            this.fetchData()
        },
        fetchData() {
            this.loading = true
            geneSetList({
                page: this.page,
                keyword: this.keyword,
                project_id: this.project_id,
                order_key: this.order_key,
                order_value: this.order_value
            })
                .then(({ total, list, perPage }) => {
                    this.perPage = perPage
                    this.list = list
                    this.total = total
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
