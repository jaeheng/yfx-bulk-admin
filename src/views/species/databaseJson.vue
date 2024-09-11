<template>
  <el-dialog v-model="visible" title="详细信息: database.json">
    <pre class="database-json"><code class="block">{{ data }}</code></pre>
  </el-dialog>
</template>
<style lang="scss">
.database-json {
  code {
    font-size: 16px;
  }
}
</style>
<script>
export default {
  data () {
    return {
      data: {},
      visible: false
    }
  },
  methods: {
    show (row) {
      this.data = row
      this.visible = true
    }
  }
}
</script>
