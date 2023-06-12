<template>
  <el-table class="tool-list" :data="data" size="small">
    <el-table-column type="expand">
      <template #default="scope">
        <el-descriptions
            class="tool-list-description"
            :column="1"
            border
        >
          <el-descriptions-item label="个数限制">
            {{ scope.row.min }}-{{ scope.row.max }}
          </el-descriptions-item>
          <el-descriptions-item label="工具介绍">
            <el-divider content-position="left">【中文】</el-divider>
            {{ scope.row.desc }}
            <el-divider content-position="left">【英文】</el-divider>
            {{ scope.row.en_desc }}
          </el-descriptions-item>
          <el-descriptions-item label="注意事项">
            <el-divider content-position="left">【中文】</el-divider>
            <div v-html="scope.row.notice"></div>
            <el-divider content-position="left">【英文】</el-divider>
            <div v-html="scope.row.en_notice"></div>
          </el-descriptions-item>
          <el-descriptions-item label="参考引用">
            <el-divider content-position="left">【中文】</el-divider>
            <div v-html="scope.row.reference"></div>
            <el-divider content-position="left">【英文】</el-divider>
            <div v-html="scope.row.en_reference"></div>
          </el-descriptions-item>
          <el-descriptions-item label="方法描述">
            <el-divider content-position="left">【中文】</el-divider>
            <div v-html="scope.row.method_desc"></div>
            <el-divider content-position="left">【英文】</el-divider>
            <div v-html="scope.row.en_method_desc"></div>
          </el-descriptions-item>
          <el-descriptions-item label="结果说明">
            <el-divider content-position="left">【中文】</el-divider>
            <div v-html="scope.row.caption"></div>
            <el-divider content-position="left">【英文】</el-divider>
            <div v-html="scope.row.en_caption"></div>
          </el-descriptions-item>
        </el-descriptions>
      </template>
    </el-table-column>
    <el-table-column label="ID" prop="id" width="80"></el-table-column>
    <el-table-column label="排序" width="100">
      <template #default="scope">
        <el-input v-model="scope.row.sort" type="number" @change="sortChange(scope.row)" size="small" style="width: 50px;"></el-input>
      </template>
    </el-table-column>
    <el-table-column label="图标" width="100">
      <template #default="scope">
        <el-image :src="scope.row.img" class="icon" style="height: 32px;"></el-image>
      </template>
    </el-table-column>
    <el-table-column label="工具名称" prop="tool_name">
      <template #default="scope">
        {{ scope.row.tool_name }}({{ scope.row.en_tool_name }})<i class="iconfont" :class="scope.row.badge" :style="{ color: scope.row.badge_color, fontSize: '28px' }"></i>
      </template>
    </el-table-column>
    <el-table-column label="工具key" prop="tool_key"></el-table-column>
    <el-table-column label="物种相关" width="100px" prop="species_related">
      <template #default="scope">
        <el-tag size="small" type="success" v-if="scope.row.species_related">相关</el-tag>
        <el-tag size="small" type="warning" v-else>不相关</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="状态" width="100px" prop="show">
      <template #default="scope">
        <el-tag size="small" type="success" v-if="scope.row.show">显示</el-tag>
        <el-tag size="small" type="warning" v-else>隐藏</el-tag>
      </template>
    </el-table-column>
    <el-table-column label="操作" width="100px">
      <template #default="scope">
        <router-link :to="{ path: '/tool/edit/' + platform, query: { id: scope.row.id, platform: platform } }">
          <el-button type="primary" size="small">编辑</el-button>
        </router-link>
      </template>
    </el-table-column>
  </el-table>
</template>
<style lang="scss">
.tool-list-description .el-descriptions__label.el-descriptions__cell.is-bordered-label {
  width: 200px;
}
.tool-list {
  .icon {
    width: 35px;
  }
}
</style>
<script>
export default {
  props: ['data', 'platform'],
  methods: {
    sortChange (row) {
      this.$util.post(this.api.toolSortChange, { id: row.id, sort: row.sort, platform: this.platform }, resp => {
        this.$message.success('保存成功')
        this.$emit('refresh')
      }, () => {
      })
    }
  }
}
</script>
