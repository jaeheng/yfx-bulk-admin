<template>
    <PageHeader description="查看样本相关统计信息" :has-bread="true" :image="image" />
    <el-card shadow="never" v-loading="loading">
        <el-row class="static-item">
            <el-col :span="24">
                <h3>总样本数</h3>
                <p class="num">{{ sample_count }}</p>
            </el-col>
        </el-row>
    </el-card>
    <el-card shadow="never" style="margin-top: 15px">
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

export default {
    components: { SampleState, PageHeader },
    data() {
        const date = new Date()
        return {
            image,
            year: `${date.getFullYear()}`,
            sample_count: 0,
            loading: false
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            this.$util.get(
                this.api.index,
                {},
                (resp) => {
                    this.sample_count = resp.total_sample_count
                    this.loading = false
                },
                () => {
                    this.loading = false
                }
            )
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
