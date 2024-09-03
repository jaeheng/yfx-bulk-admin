<template>
    <div class="dashboard">
        <el-row class="static-item" :gutter="15" style="margin-bottom: 15px" v-loading="loading">
            <el-col :span="6">
                <el-card shadow="never" class="border-less">
                    <p class="num">
                        总项目数: <strong>{{ statistic.project_total }}</strong>
                    </p>
                    <p>最近一月新增: {{ statistic.project_month_count }}</p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" class="border-less">
                    <p class="num">
                        总任务数: <strong>{{ statistic.task_total }}</strong>
                    </p>
                    <p>运行中: {{ statistic.task_running }} 失败任务: {{ statistic.task_error }}</p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" class="border-less">
                    <p class="num">
                        数据大小: <strong>{{ statistic.storage_size }}</strong>
                    </p>
                    <p>
                        <router-link to="/statistic/storage">查看更多</router-link>
                    </p>
                </el-card>
            </el-col>
            <el-col :span="6">
                <el-card shadow="never" class="border-less">
                    <p class="num">
                        总样本数: <strong>{{ statistic.sample_total }}</strong>
                    </p>
                    <p>
                        <router-link to="/statistic/sample">查看更多</router-link>
                    </p>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="15" style="margin-top: 15px">
            <el-col :span="12">
                <el-card shadow="never" class="border-less">
                    <template #header>
                        {{ month }}月份每天的任务情况
                        <el-date-picker
                            v-model="month"
                            type="month"
                            format="YYYY/MM"
                            value-format="YYYYMM"
                            size="small"
                            style="float: right"
                            @change="dateChange('monthChart')"
                        ></el-date-picker>
                    </template>

                    <TaskState
                        ref="monthChart"
                        :type="30"
                        :date="month"
                        :title="`${month}`"
                    ></TaskState>
                </el-card>
                <ToolState style="margin-top: 15px" :chart-height="500" />
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" class="border-less">
                    <template #header>
                        {{ year }}年样本数统计情况
                        <el-date-picker
                            v-model="yearSample"
                            type="year"
                            format="YYYY"
                            value-format="YYYY"
                            size="small"
                            style="float: right"
                            @change="dateChange('yearSampleChart')"
                        ></el-date-picker>
                    </template>
                    <SampleState
                        ref="yearSampleChart"
                        :year="yearSample"
                        :title="`${yearSample}`"
                    ></SampleState>
                </el-card>
                <ErrorTaskList style="margin-top: 15px" />
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss">
.dashboard {
    padding: 15px;
    max-width: 100%;
    box-sizing: border-box;
}
</style>

<script>
import ToolState from '_c/ToolState.vue'
import TaskState from '_c/TaskState.vue'
import SampleState from '_c/SampleState.vue'
import ErrorTaskList from '_c/ErrorTaskList.vue'
import { indexStatistic } from '@/request/modules/statistic'

export default {
    components: {
        ErrorTaskList,
        ToolState,
        TaskState,
        SampleState
    },
    data() {
        const date = new Date()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month > 9 ? String(month) : `0${month}`
        day = day > 9 ? String(day) : `0${day}`
        return {
            statistic: {
                project_total: 0,
                project_month_count: 0,
                sample_total: 0,
                storage_size: 0,
                task_total: 0,
                task_success: 0,
                task_queue: 0,
                task_error: 0,
                task_running: 0
            },
            loading: false,
            month: `${date.getFullYear()}${month}`,
            day: `${date.getFullYear()}${month}${day}`,
            year: `${date.getFullYear()}`,
            yearSample: `${date.getFullYear()}`
        }
    },
    methods: {
        getData() {
            this.loading = true
            indexStatistic()
                .then((resp) => {
                    Object.keys(this.statistic).map((k) => {
                        this.statistic[k] = resp[k]
                    })
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        dateChange(ref) {
            this.$refs[ref].fetchData()
        }
    },
    mounted() {
        this.getData()
    }
}
</script>
