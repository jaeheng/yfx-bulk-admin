<template>
    <div class="user-statistic-chart-scroll" v-loading="loading">
        <div ref="chart" :style="{ height: chartHeight + 'px' }"></div>
    </div>
</template>

<style lang="scss" scoped>
.user-statistic-chart-scroll {
    max-height: 700px;
    overflow-y: auto;
}
</style>

<script>
import Plotly from '@/libs/plotly'

export default {
    props: {
        loader: {
            type: Function,
            required: true
        },
        valueKey: {
            type: String,
            required: true
        },
        valueLabel: {
            type: String,
            required: true
        },
        formattedValueKey: {
            type: String,
            default: ''
        },
        tickSuffix: {
            type: String,
            default: ''
        },
        colorscale: {
            type: String,
            default: 'Blues'
        }
    },
    data() {
        return {
            data: [],
            loading: false
        }
    },
    computed: {
        chartHeight() {
            return Math.max(500, this.data.length * 28)
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            this.loader()
                .then((resp) => {
                    this.data = resp || []
                    this.$nextTick(this.draw)
                })
                .catch(() => {
                    this.data = []
                })
                .finally(() => {
                    this.loading = false
                })
        },
        draw() {
            if (!this.$refs.chart) return

            const labels = this.data.map((item, index) => {
                const user = item.yfx_id || `ID:${item.project_id}`
                const deleted = item.is_deleted ? '（已删除）' : ''
                return `${index + 1}. ${user} / ${item.project}${deleted}`
            })
            const values = this.data.map((item) => item[this.valueKey])
            const formattedValues = this.data.map((item) => {
                return this.formattedValueKey ? item[this.formattedValueKey] : item[this.valueKey]
            })

            Plotly.react(
                this.$refs.chart,
                [
                    {
                        x: values,
                        y: labels,
                        type: 'bar',
                        orientation: 'h',
                        text: formattedValues,
                        customdata: formattedValues,
                        textposition: 'outside',
                        cliponaxis: false,
                        marker: {
                            color: values,
                            colorscale: this.colorscale
                        },
                        hovertemplate: `%{y}<br>${this.valueLabel}：%{customdata}<extra></extra>`
                    }
                ],
                {
                    height: this.chartHeight,
                    margin: {
                        top: 10,
                        right: 70,
                        bottom: 50,
                        left: 280
                    },
                    xaxis: {
                        title: this.valueLabel,
                        rangemode: 'tozero',
                        showgrid: true,
                        tickformat: this.tickSuffix ? '~s' : undefined,
                        ticksuffix: this.tickSuffix
                    },
                    yaxis: {
                        autorange: 'reversed',
                        automargin: true,
                        type: 'category'
                    },
                    bargap: 0.25
                },
                {
                    displayModeBar: false,
                    responsive: true
                }
            )
        }
    },
    mounted() {
        this.fetchData()
    },
    beforeUnmount() {
        if (this.$refs.chart) Plotly.purge(this.$refs.chart)
    }
}
</script>
