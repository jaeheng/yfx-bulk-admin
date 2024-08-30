<template>
    <span>
        <el-button size="small" type="primary" round @click="show">查看</el-button>
        <el-dialog append-to-body width="1300px" v-model="visible" title="任务运行状态">
            <div style="margin-bottom: 15px">
                <el-button @click="fetchData" :loading="loading">刷新</el-button>
            </div>
            <pre
                style="padding: 15px; background: #eee; line-height: 2; white-space: pre-wrap"
                v-loading="loading"
                >{{ output }}</pre
            >
        </el-dialog>
    </span>
</template>

<script>
import { taskState } from '@/request/modules/task'

export default {
    props: ['id'],
    data() {
        return {
            loading: false,
            visible: false,
            output: ''
        }
    },
    methods: {
        show() {
            this.visible = true
            this.fetchData()
        },
        fetchData() {
            this.loading = true
            taskState(this.id)
                .then(({ output }) => {
                    this.output = output
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    }
}
</script>
