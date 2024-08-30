<template>
    <div class="task">
        <page-header
            description="对系统任务队列进行查询、操作"
            has-bread
            :image="image"
            :hasBread="false"
        />
        <el-card shadow="hover" header="队列列表" style="margin-top: 10px">
            <el-table :data="tableData" v-loading="loading" row-key="id" default-expand-all>
                <el-table-column label="ID" prop="id" width="120" />
                <el-table-column label="created_at" prop="created_at" />
                <el-table-column label="available_at" prop="available_at" />
                <el-table-column label="attempts" prop="attempts" />
                <el-table-column label="queue" prop="queue" />
                <el-table-column label="reserved_at" prop="reserved_at" />
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
        </el-card>
    </div>
</template>

<script>
import PageHeader from '_c/PageHeader.vue'
import image from '@img/task.png'
import { PAGE_LAYOUT } from '@/config/app'
import { taskQueue } from '@/request/modules/task'
import PreButton from '_c/preButton.vue'

export default {
    components: {
        PreButton,
        PageHeader
    },
    data() {
        return {
            image,
            total: 0,
            page: 1,
            tableData: [],
            perPage: 15,
            PAGE_LAYOUT,
            loading: false
        }
    },
    methods: {
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
        fetchData() {
            let page = this.page
            this.loading = true
            taskQueue({ page })
                .then((resp) => {
                    this.tableData = resp.list || []
                    this.total = resp.total || 0
                    this.perPage = resp.perPage || 15
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
