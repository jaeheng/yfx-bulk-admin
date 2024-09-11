<template>
    <page-header description="查看系统日志" :image="image" :has-bread="false" />

    <el-table :data="list">
        <el-table-column label="ID" property="id"></el-table-column>
        <el-table-column label="模块" property="module"></el-table-column>
        <el-table-column label="消息" property="message"></el-table-column>
        <el-table-column label="操作时间" property="created_at"></el-table-column>
        <el-table-column label="操作用户" property="user.project"></el-table-column>
        <el-table-column label="操作IP" property="ip">
            <template #default="scope">
                {{ scope.row.ip }}
                <a :href="`https://www.ipuu.net/query/ip?search=${scope.row.ip}`" target="_blank"
                    >查询</a
                >
            </template>
        </el-table-column>
        <el-table-column label="payload">
            <template #default="scope">
                <pre-button :data="scope.row.payload" />
            </template>
        </el-table-column>
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
import { getLogList } from '@/request/modules/log'
import PageHeader from '_c/PageHeader.vue'
import image from '@/assets/images/pass.svg'
import PreButton from '_c/preButton.vue'
import { PAGE_LAYOUT } from '@/config/app'

export default {
    components: { PreButton, PageHeader },
    data() {
        return {
            PAGE_LAYOUT,
            image,
            list: [],
            loading: false,
            total: 0,
            page: 1,
            perPage: 15,
            keyword: '',
            columns: ['id', 'module', 'message', 'created_at', 'uid', 'ip', 'payload']
        }
    },
    methods: {
        currentChange(page) {
            this.page = page
            this.fetchData()
        },
        fetchData() {
            this.loading = true
            getLogList({
                page: this.page,
                keyword: this.keyword
            })
                .then(({ total, list, perPage }) => {
                    this.list = list
                    this.total = total
                    this.perPage = perPage
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
