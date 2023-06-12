<template>
  <span>
    <el-button size="small" circle plain @click="visible = true"><i class="iconfont icon-more"></i></el-button>
    <el-dialog
        append-to-body
        width="1300px"
        v-model="visible">
      <el-descriptions border :column="1">
        <el-descriptions-item label="路径">
          <pre class="code">{{ data.path }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="常用命令">
          开始任务:
          <pre class="code">python {{ monitorPath }}package/src/task/start.py {{ data.id }}</pre>

          <template></template>
          <template v-if="data.analysis_tool.tool_key === 'reCluster'">
            结束任务:
            <pre class="code">聚类任务的done脚本可能要执行多次
python {{ monitorPath }}package/src/reCluster/done.py {{ data.id }}</pre>
          </template>
          <template v-else>
            结束任务:
            <pre class="code">python {{ monitorPath }}package/src/task/done.py {{ data.id }}</pre>
          </template>
        </el-descriptions-item>
        <el-descriptions-item label="时间">
          <div>创建时间: {{ data.created_at }}</div>
          <div>开始时间: {{ data.start_time }}</div>
          <div>结束时间: {{ data.end_time }}</div>
          <div>删除时间: {{ data.deleted_at }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          <p>{{ data.remarks || '-' }}</p>
        </el-descriptions-item>
        <el-descriptions-item label="日志">
          <pre class="import-log" v-html="data.message || '无日志产生'"></pre>
        </el-descriptions-item>
        <el-descriptions-item label="参数">
          <pre class="code">{{ data.analysis_params || '无参数' }}</pre>
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </span>
</template>

<script>
import {DATA_TYPE} from "@/config/app";

export default {
  props: ['data'],
  data() {
    return {
      visible: false,
      DATA_TYPE
    }
  },
  computed: {
    monitorPath () {
      let path = '-'
      if ([DATA_TYPE.cell, DATA_TYPE.gene].includes(this.data.data_type)) {
        path = '/SC1/YFX/monitor/'
      }
      if ([DATA_TYPE.stCell, DATA_TYPE.stGene].includes(this.data.data_type)) {
        path = '/SC1/YFX/stmonitor/'
      }
      return path
    }
  }
}
</script>
