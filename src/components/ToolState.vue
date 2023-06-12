<template>
  <el-card v-loading="loading" shadow="hover">
    <div id="tool-state" :style="{ height: chartHeight + 'px' }"></div>
  </el-card>
</template>

<script>
import Plotly from '@/libs/plotly'
export default {
  props: {
    chartHeight: {
      type: Number,
      default: 360
    }
  },
  data () {
    return {
      x: [],
      y: [],
      loading: false
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      this.$util.get(this.api.indexTool, {}, resp => {
        const temp = resp.x.map((x, i) => {
          return {
            x,
            y: resp.y[i]
          }
        })
        temp.sort((a, b) => {
          return b.y - a.y
        })
        let x = []
        let y = []
        temp.map(item => {
          x.push(item.x)
          y.push(item.y)
        })
        this.x = x
        this.y = y
        this.$nextTick(this.draw)
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    draw () {
      const data = [
        {
          x: this.x,
          y: this.y,
          type: 'bar',
          opacity: 0.5,
          width: 0.7,
          text: this.y,
          marker: {
            color: this.y,
            colorscale: 'Rainbow'
          }
        }
      ]

      Plotly.newPlot('tool-state', data, {
        title: '各工具任务情况',
        xaxis: {
          showgrid: false,
          automargin: true
        }
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
