<template>
    <div class="dashboard">
        <el-row :gutter="15">
            <el-col :span="12">
                <el-card shadow="hover" v-loading="loading" style="height: 220px">
                    <el-row class="static-item">
                        <el-col :span="8">
                            <h3>总项目数</h3>
                            <p class="num">{{ project }}</p>
                        </el-col>
                        <el-col :span="8">
                            <h3>总任务数</h3>
                            <p class="num">{{ task }}</p>
                        </el-col>
                        <el-col :span="8">
                            <h3>数据大小</h3>
                            <p class="num">{{ total_size }}</p>
                        </el-col>
                        <el-col :span="8">
                            <h3>总样本数</h3>
                            <p class="num">{{ total_sample_count }}</p>
                        </el-col>
                        <el-col :span="8">
                            <h3>外部端口状态</h3>
                            <i style="color: #ff461f;" class="static-icon iconfont icon-warning" title="存在异常"
                               v-if="sld"></i>
                            <i style="color: #13ce66;" class="static-icon iconfont icon-success" v-else></i>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover" v-loading="loading" style="height: 220px">
                    <el-row class="entry-items" :gutter="20">
                        <el-col :span="8">
                            <div class="entry-item" @click="$router.push('/projects/create')">
                                <i class="iconfont icon-plus"></i>
                                <span>创建项目账号</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="entry-item" @click="$router.push('/projects/company')">
                                <i class="iconfont icon-company"></i>
                                <span>查看公司信息</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="entry-item">
                                <i class="iconfont icon-shenqing"></i>
                                <span>审批试用账号</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="entry-item" @click="$router.push('/tool/sc')">
                                <i class="iconfont icon-sc"></i>
                                <span>工具列表</span>
                            </div>
                        </el-col>
                        <el-col :span="8">
                            <div class="entry-item" @click="$router.push('/system/species')">
                                <i class="iconfont icon-mouse"></i>
                                <span>物种管理</span>
                            </div>
                        </el-col>
                    </el-row>
                </el-card>
            </el-col>
        </el-row>

        <el-row :gutter="15" style="margin-top: 15px;">
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        {{ month }}月份每天的任务情况
                        <el-date-picker v-model="month"
                                        type="month"
                                        format="YYYY/MM"
                                        value-format="YYYYMM"
                                        size="small"
                                        style="float: right"
                                        @change="dateChange('monthChart')"
                        ></el-date-picker>
                    </template>

                    <TaskState ref="monthChart" :type="30" :date="month" :title='`${month}`'></TaskState>
                </el-card>
                <ToolState style="margin-top: 15px;" :chart-height="500"/>
            </el-col>
            <el-col :span="12">
                <el-card shadow="hover">
                    <template #header>
                        {{ year }}年样本数统计情况
                        <el-date-picker v-model="yearSample"
                                        type="year"
                                        format="YYYY"
                                        value-format="YYYY"
                                        size="small"
                                        style="float: right"
                                        @change="dateChange('yearSampleChart')"
                        ></el-date-picker>
                    </template>
                    <SampleState ref="yearSampleChart" :year="yearSample" :title='`${yearSample}`'></SampleState>
                </el-card>
                <ErrorTaskList style="margin-top: 15px;"/>
            </el-col>
        </el-row>
    </div>
</template>

<style lang="scss">
.dashboard {
    padding: 25px;
    max-width: 100%;
    box-sizing: border-box;
}

.entry-item {
    display: flex;
    background: #f2f6fc;
    margin-bottom: 20px;
    flex-direction: column;
    align-items: center;
    padding: 12px 0;
    cursor: pointer;

    &:hover {
        opacity: .9;
        color: #1d42ab;
    }

    i {
        font-size: 32px;
    }
}
</style>

<script>
import ToolState from '_c/ToolState.vue'
import TaskState from '_c/TaskState.vue'
import SampleState from '_c/SampleState.vue'
import ErrorTaskList from '_c/ErrorTaskList.vue'

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
            project: 0,
            task: 0,
            complete: 0,
            fail: 0,
            not_started: 0,
            starting: 0,
            total_size: 0,
            writing: 0,
            sld: 0,
            total_sample_count: 0,
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
            this.$util.get(this.api.index, {}, resp => {
                this.project = resp.project
                this.task = resp.task
                this.complete = resp.complete
                this.fail = resp.fail
                this.not_started = resp.not_started
                this.starting = resp.starting
                this.total_size = resp.total_size
                this.writing = resp.writing
                this.sld = resp.sld
                this.total_sample_count = resp.total_sample_count
                this.loading = false
            }, () => {
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
