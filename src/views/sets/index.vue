<template>
    <el-table :data="list">
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
    >
    </el-pagination>
</template>
<script>
import { geneSetList } from '@/request/modules/geneSet'
import { PAGE_LAYOUT } from '@/config/app'

export default {
    data() {
        return {
            PAGE_LAYOUT,
            page: 1,
            total: 0,
            keyword: '',
            project_id: '',
            list: [],
            perPage: 15
        }
    },
    methods: {
        currentChange(page) {
            this.page = page
            this.fetchData()
        },
        fetchData() {
            geneSetList({
                page: this.page,
                keyword: this.keyword,
                project_id: this.project_id
            }).then(({ total, list, perPage }) => {
                this.perPage = perPage
                this.list = list
                this.total = total
            })
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
