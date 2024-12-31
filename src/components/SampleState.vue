<template>
    <div v-loading="loading">
        <div :id="id" style="height: 260px"></div>
    </div>
</template>

<script>
import Plotly from '@/libs/plotly'
import { indexSample } from '@/request/modules/statistic'

export default {
    props: ['year', 'title'],
    data() {
        return {
            id: 'bar-' + Math.random(),
            x: [],
            count: [],
            loading: false
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexSample(this.year)
                .then((resp) => {
                    this.x = resp.month
                    this.count = resp.count
                    this.$nextTick(this.draw)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        draw() {
            const data = [
                {
                    x: this.x.map((item) => item + '月'),
                    y: this.count,
                    type: 'bar',
                    opacity: 0.5,
                    width: 0.3,
                    text: this.count,
                    hovertemplate: `${this.title}/%{x}导入了%{y}个样本`,
                    name: '样本数'
                }
            ]

            Plotly.newPlot(
                this.id,
                data,
                {
                    xaxis: {
                        showgrid: false,
                        automargin: true,
                        type: 'category'
                    },
                    yaxis: {
                        automargin: true
                    },
                    margin: {
                        t: 0,
                        b: 0
                    },
                    hovermode: 'x unified'
                },
                {
                    displayModeBar: false
                }
            )
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
