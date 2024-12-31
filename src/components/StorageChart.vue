<template>
    <div :id="chartID" style="height: 400px"></div>
</template>

<script>
import { indexStorage } from '@/request/modules/statistic'
import Plotly from '@/libs/plotly'
import { formatBytes } from '@/libs/functions'

export default {
    data() {
        return {
            chartID: 'id-' + Math.random(),
            loading: false,
            x: [],
            y: []
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexStorage()
                .then(({ x, y }) => {
                    this.x = x
                    this.y = y
                    this.loading = false
                    this.$nextTick(this.draw)
                })
                .catch(() => {
                    this.loading = false
                })
        },
        draw() {
            const data = [
                {
                    x: this.x,
                    y: this.y,
                    type: 'scatter',
                    mode: 'lines',
                    width: 0.7,
                    text: this.y.map((v) => {
                        return formatBytes(v)
                    }),
                    line: {
                        shape: 'spline', // 设置曲线为平滑曲线
                        color: 'blue', // 曲线颜色
                        width: 2 // 曲线宽度
                    },
                    hovertemplate: `%{text}`,
                    name: '存储大小统计'
                }
            ]

            Plotly.newPlot(
                this.chartID,
                data,
                {
                    xaxis: {
                        showgrid: false,
                        automargin: true,
                        type: 'category'
                    },
                    yaxis: {
                        showgrid: false,
                        automargin: true,
                        tickformat: '~s',
                        ticksuffix: 'B'
                    },
                    hovermode: 'x unified',
                    margin: {
                        t: 0,
                        b: 0
                    }
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
