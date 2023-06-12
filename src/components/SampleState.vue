<template>
  <div v-loading="loading">
    <div :id="id" style="height: 260px"></div>
  </div>
</template>

<script>
import Plotly from '@/libs/plotly'
import {indexSample} from "@/request/modules/statistic";
export default {
  props: ['year', 'title'],
  data () {
    return {
      id: 'bar-' + Math.random(),
      x: [],
      sc: [],
      st: [],
      loading: false
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      indexSample(this.year).then(resp => {
        this.x = resp.month
        this.sc = resp.sc
        this.st = resp.st
        this.$nextTick(this.draw)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    draw () {
      const data = [
        {
          x: this.x.map(item => item + '月'),
          y: this.sc,
          type: 'line',
          opacity: 0.5,
          width: 0.3,
          text: this.sc,
          marker: {
            color: '#f0f'
          },
          hovertemplate: `${this.title}/%{x}导入了%{y}个单细胞样本`,
          name: '单细胞样本数'
        },
        {
          x: this.x.map(item => item + '月'),
          y: this.st,
          type: 'line',
          opacity: 0.5,
          width: 0.3,
          text: this.st,
          marker: {
            color: '#00a6ff'
          },
          hovertemplate: `${this.title}/%{x}导入了%{y}个空间样本`,
          name: '空间样本数'
        }
      ]

      Plotly.newPlot(this.id, data, {
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
      }, {
        displayModeBar: false
      })
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
