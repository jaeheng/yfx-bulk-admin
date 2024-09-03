<template>
    <PageHeader description="查看样本相关统计信息" :has-bread="true" :image="image" />
    <el-card shadow="never" class="border-less" v-loading="loading">
        <p class="num">
            总样本数: <strong>{{ sample_total }}</strong>
        </p>
    </el-card>
    <el-card shadow="never" class="border-less" style="margin-top: 15px">
        <template #header>
            {{ year }}年样本数统计情况
            <el-date-picker
                v-model="year"
                type="year"
                format="YYYY"
                value-format="YYYY"
                size="small"
                style="float: right"
                @change="$refs.yearSampleChart.fetchData()"
            ></el-date-picker>
        </template>
        <SampleState ref="yearSampleChart" :year="year" :title="`${year}`"></SampleState>
    </el-card>
</template>

<script>
import image from '@img/statistic.svg'
import PageHeader from '_c/PageHeader.vue'
import SampleState from '_c/SampleState.vue'
import { indexStatistic } from '@/request/modules/statistic'

export default {
    components: { SampleState, PageHeader },
    data() {
        const date = new Date()
        return {
            image,
            year: `${date.getFullYear()}`,
            sample_total: 0,
            loading: false
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexStatistic()
                .then(({ sample_total }) => {
                    this.sample_total = sample_total
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
