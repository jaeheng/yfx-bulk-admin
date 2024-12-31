<template>
    <PageHeader description="可以按年、月、日来统计任务数量" :has-bread="true" :image="image" />
    <el-card shadow="never" class="border-less" v-loading="loading">
        <el-row class="static-item" style="text-align: center">
            <el-col :span="4" :offset="2">
                <p class="num">
                    总任务数 <strong>{{ task_total }}</strong>
                </p>
            </el-col>
            <el-col :span="4">
                <p class="num">
                    已完成任务: <strong>{{ task_success }}</strong>
                </p>
            </el-col>
            <el-col :span="4">
                <p class="num">
                    失败任务数: <strong>{{ task_error }}</strong>
                </p>
            </el-col>
            <el-col :span="4">
                <p class="num">
                    未开始任务: <strong>{{ task_queue }}</strong>
                </p>
            </el-col>
            <el-col :span="4">
                <p class="num">
                    进行中任务: <strong>{{ task_running }}</strong>
                </p>
            </el-col>
        </el-row>
    </el-card>
    <ToolState style="margin-top: 15px" />
    <el-row justify="space-between" :gutter="15" style="margin-top: 15px">
        <el-col :span="12">
            <el-card shadow="never" class="border-less">
                <template #header>
                    {{ year }}年每月任务情况
                    <el-date-picker
                        v-model="year"
                        type="year"
                        format="YYYY"
                        value-format="YYYY"
                        size="small"
                        style="float: right"
                        @change="dateChange('yearChart')"
                    ></el-date-picker>
                </template>
                <TaskState
                    ref="yearChart"
                    :type="365"
                    :date="year"
                    :title="`${year}`"
                    color="#13ce66"
                    @change="monthChange"
                ></TaskState>
            </el-card>
        </el-col>
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
                    @change="dayChange"
                ></TaskState>
            </el-card>
        </el-col>
    </el-row>
    <el-card shadow="never" class="border-less" style="margin-top: 15px">
        <template #header>
            {{ day }}每小时的任务情况
            <el-date-picker
                v-model="day"
                type="date"
                format="YYYY/MM/DD"
                value-format="YYYYMMDD"
                size="small"
                style="float: right"
                @change="dateChange('dayChart')"
            ></el-date-picker>
        </template>

        <TaskState ref="dayChart" :type="1" :date="day" :title="`${day}`" color="#f00"></TaskState>
    </el-card>
</template>

<script>
import ToolState from '_c/ToolState.vue'
import TaskState from '_c/TaskState.vue'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/statistic.svg'
import { indexStatistic } from '@/request/modules/statistic'

export default {
    components: {
        PageHeader,
        ToolState,
        TaskState
    },
    data() {
        const date = new Date()
        let month = date.getMonth() + 1
        let day = date.getDate()
        month = month > 9 ? String(month) : `0${month}`
        day = day > 9 ? String(day) : `0${day}`
        return {
            image,
            month: `${date.getFullYear()}${month}`,
            day: `${date.getFullYear()}${month}${day}`,
            year: `${date.getFullYear()}`,
            loading: false,
            task_total: 0,
            task_success: 0,
            task_queue: 0,
            task_error: 0,
            task_running: 0
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexStatistic()
                .then(({ task_total, task_success, task_queue, task_error, task_running }) => {
                    this.task_total = task_total
                    this.task_success = task_success
                    this.task_queue = task_queue
                    this.task_error = task_error
                    this.task_running = task_running
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        dateChange(ref) {
            this.$refs[ref].fetchData()
        },
        monthChange(month) {
            this.month = month
            this.$nextTick(() => {
                this.dateChange('monthChart')
            })
        },
        dayChange(day) {
            this.day = day
            this.$nextTick(() => {
                this.dateChange('dayChart')
            })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
