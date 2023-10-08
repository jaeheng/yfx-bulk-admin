<template>
  <span>
    <el-button size="small" circle plain @click="visible = true"
      ><i class="iconfont icon-more"></i
    ></el-button>
    <el-dialog append-to-body width="1300px" v-model="visible">
      <el-descriptions border :column="1">
        <el-descriptions-item label="路径">
          <pre class="code">{{ data.path }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="常用命令">
          开始任务:
          <pre class="code">{{ data.scripts.start }}</pre>
          结束任务:
          <pre class="code">{{ data.scripts.end }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="时间">
          <div>创建时间: {{ data.created_at }}</div>
          <div>开始时间: {{ data.start_time }}</div>
          <div>结束时间: {{ data.end_time }}</div>
          <div>删除时间: {{ data.deleted_at }}</div>
          <div>更新时间: {{ data.updated_at }}</div>
        </el-descriptions-item>
        <el-descriptions-item label="备注">
          <p>{{ data.remarks || '-' }}</p>
        </el-descriptions-item>

        <el-descriptions-item label="日志">
          <pre class="import-log" v-html="data.run_log || '无日志产生'"></pre>
        </el-descriptions-item>
        <el-descriptions-item label="参数">
          <pre class="code">{{ data.params || '无参数' }}</pre>
        </el-descriptions-item>
        <el-descriptions-item label="bzip2 md5">
          {{ data.md5 || '-' }}
        </el-descriptions-item>
        <el-descriptions-item label="是否有子任务">
          {{ data.has_children ? '有， PID=' + data.pid : '无' }}
        </el-descriptions-item>
        <el-descriptions-item label="root_id">
          {{ data.root_id }}
        </el-descriptions-item>
        <el-descriptions-item label="是否被用户收藏">
          {{ data.is_collect === 'T' ? '是' : '否' }}
        </el-descriptions-item>
      </el-descriptions>
    </el-dialog>
  </span>
</template>

<script>
export default {
  props: ['data'],
  data() {
    return {
      visible: false
    }
  }
}
</script>
