<template>
    <el-card shadow="never" class="border-less">
        <template #header>
            <span style="color: red"
                ><i class="iconfont icon-error"></i> 失败任务 (共{{ total }}个)</span
            >

            <el-button
                circle
                size="small"
                style="float: right"
                @click="fetchData"
                :loading="loading"
            >
                <el-icon>
                    <Refresh />
                </el-icon>
            </el-button>
        </template>
        <el-table :data="tableData" v-loading="loading" stripe size="small">
            <el-table-column label="ID" prop="id" width="80" />
            <el-table-column label="任务名称" prop="task_name" />
            <el-table-column label="所属项目" prop="project.project" />
            <el-table-column label="分析工具" prop="tool.tool_name" />
            <el-table-column label="创建时间" prop="created_at" />
            <el-table-column label="操作" width="130">
                <template #default="scope">
                    <more :data="scope.row"></more>
                    <task-retry-button
                        :id="scope.row.id"
                        @success="fetchData"
                        style="margin-left: 10px"
                    />
                </template>
            </el-table-column>
        </el-table>

        <el-pagination
            background
            :layout="PAGE_LAYOUT"
            :total="total"
            :page-size="PAGE_SIZE"
            @current-change="currentChange"
        >
        </el-pagination>
    </el-card>
</template>

<script>
import { PAGE_LAYOUT, PAGE_SIZE } from '@/config/app'
import more from './TaskMore.vue'
import { failTaskList } from '@/request/modules/task'
import TaskRetryButton from '_c/TaskRetryButton.vue'
import { Refresh } from '@element-plus/icons-vue'

export default {
    components: {
        TaskRetryButton,
        more,
        Refresh
    },
    data() {
        return {
            tableData: [],
            form: {
                keyword: '',
                state: [2],
                uid: '',
                displayType: 'normal'
            },
            page: 1,
            total: 0,
            loading: false,
            dataType: this.$appConfig.dataType,
            PAGE_LAYOUT,
            PAGE_SIZE
        }
    },
    methods: {
        fetchData() {
            let page = this.page
            let form = this.form
            this.loading = true
            failTaskList({ page, ...form })
                .then((resp) => {
                    this.tableData = resp.list || []
                    this.total = resp.total || 0
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        /**
         * 翻页
         */
        currentChange(page) {
            this.page = page
            this.fetchData()
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
