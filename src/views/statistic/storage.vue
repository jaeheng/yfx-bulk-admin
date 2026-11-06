<template>
    <PageHeader description="查看数据存储空间相关统计信息" :has-bread="true" :image="image" />
    <el-card shadow="never" class="border-less" v-loading="loading">
        <p class="num">
            总数据大小: <strong>{{ storage_size }}</strong>
        </p>
    </el-card>
    <el-card shadow="never" style="margin-top: 15px" class="border-less">
        <template #header> 数据大小增长情况</template>
        <storage-chart />
    </el-card>
    <el-card shadow="never" class="border-less" style="margin-top: 15px">
        <template #header>用户数据大小排行（前100名）</template>
        <UserStatisticChart
            :loader="userStorageLoader"
            value-key="storage_size"
            formatted-value-key="storage_size_text"
            value-label="数据大小"
            tick-suffix="B"
            colorscale="Oranges"
        />
    </el-card>
</template>

<script>
import image from '@img/statistic.svg'
import PageHeader from '_c/PageHeader.vue'
import StorageChart from '_c/StorageChart.vue'
import UserStatisticChart from '_c/UserStatisticChart.vue'
import { indexStatistic, indexStorageByUser } from '@/request/modules/statistic'

export default {
    components: { UserStatisticChart, StorageChart, PageHeader },
    data() {
        const date = new Date()
        return {
            image,
            year: `${date.getFullYear()}`,
            storage_size: 0,
            loading: false,
            userStorageLoader: indexStorageByUser
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexStatistic()
                .then(({ storage_size }) => {
                    this.storage_size = storage_size
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
