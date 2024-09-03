<template>
    <PageHeader description="可以按年、月、日来统计任务数量" :has-bread="true" :image="image" />
    <el-card shadow="never" v-loading="loading">
        <el-row class="static-item">
            <el-col :span="4">
                <h3>总任务数</h3>
                <p class="num">{{ task }}</p>
            </el-col>
            <el-col :span="4">
                <h3>已完成任务</h3>
                <p class="num">{{ complete }}</p>
            </el-col>
            <el-col :span="4">
                <h3>失败任务数</h3>
                <p class="num">{{ fail }}</p>
            </el-col>
            <el-col :span="4">
                <h3>未开始任务</h3>
                <p class="num">{{ not_started }}</p>
            </el-col>
            <el-col :span="4">
                <h3>进行中任务</h3>
                <p class="num">{{ starting }}</p>
            </el-col>
            <el-col :span="4">
                <h3>写入中任务</h3>
                <p class="num">{{ writing }}</p>
            </el-col>
        </el-row>
    </el-card>
    <ToolState style="margin-top: 15px" />
    <el-row justify="space-between" :gutter="15" style="margin-top: 15px">
        <el-col :span="12">
            <el-card shadow="never">
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
            <el-card shadow="never">
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
    <el-card shadow="never" style="margin-top: 15px">
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
            task: 0,
            complete: 0,
            fail: 0,
            not_started: 0,
            starting: 0,
            total_size: 0,
            writing: 0
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            this.$util.get(
                this.api.index,
                {},
                (resp) => {
                    this.task = resp.task
                    this.complete = resp.complete
                    this.fail = resp.fail
                    this.not_started = resp.not_started
                    this.starting = resp.starting
                    this.total_size = resp.total_size
                    this.writing = resp.writing
                    this.loading = false
                },
                () => {
                    this.loading = false
                }
            )
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
