<template>
  <div v-loading="loading">
    <div :id="id" style="height: 260px"></div>
  </div>
</template>

<script>
import Plotly from '@/libs/plotly'
import {indexTask} from "@/request/modules/statistic";
export default {
  props: ['type', 'date', 'title', 'color', 'control'],
  emits: ['change'],
  data () {
    return {
      id: 'task-state' + Math.random(),
      x: [],
      y: [],
      loading: false
    }
  },
  computed: {
    typeText () {
      const text = {
        1: '点',
        30: '日',
        365: '月'
      }
      return text[this.type]
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      indexTask({ type: this.type, date: this.date }).then(resp => {
        this.x = resp.x
        this.y = resp.y
        this.$nextTick(this.draw)
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    draw () {
      const data = [
        {
          x: this.x.map(item => item + this.typeText),
          y: this.y,
          type: 'bar',
          opacity: 0.5,
          width: 0.7,
          text: this.y,
          marker: {
            color: this.color || '#f0f',
            opacity: 0.5
          },
          hovertemplate: `${this.title}-%{x}${this.typeText}生成了%{y}个任务`,
          name: '任务数'
        }
      ]

      Plotly.newPlot(this.id, data, {
        xaxis: {
          showgrid: false,
          automargin: true,
          type: 'category'
        },
        yaxis: {
          showgrid: false,
          automargin: true
        },
        hovermode: 'x unified',
        margin: {
          t: 0,
          b: 0
        }
      }, {
        displayModeBar: false
      })

      if (this.type !== 1) {
        const myPlot = document.getElementById(this.id)
        myPlot.on('plotly_click', (data) => {
          console.log(data.points[0].x)
          this.$emit('change', this.date + data.points[0].x.slice(0, -1))
        })
      }
    }
  },
  mounted () {
    this.fetchData()
  }
}
</script>
