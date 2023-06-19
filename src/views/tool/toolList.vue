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
                        {{ scope.row.desc }}
                    </el-descriptions-item>
                    <el-descriptions-item label="注意事项">
                        <div v-html="scope.row.notice"></div>
                    </el-descriptions-item>
                    <el-descriptions-item label="参考引用">
                        <div v-html="scope.row.reference"></div>
                    </el-descriptions-item>
                    <el-descriptions-item label="方法描述">
                        <div v-html="scope.row.method_desc"></div>
                    </el-descriptions-item>
                    <el-descriptions-item label="结果说明">
                        <div v-html="scope.row.caption"></div>
                    </el-descriptions-item>
                </el-descriptions>
            </template>
        </el-table-column>
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="排序" width="100">
            <template #default="scope">
                <el-input v-model="scope.row.sort" type="number" @change="sortChange(scope.row)" size="small"
                          style="width: 50px;"></el-input>
            </template>
        </el-table-column>
        <el-table-column label="图标" width="100">
            <template #default="scope">
                <el-image :src="scope.row.img" class="icon" style="height: 32px;"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="工具名称" prop="tool_name">
            <template #default="scope">
                {{ scope.row.tool_name }}<i class="iconfont" :class="scope.row.badge"
                                            :style="{ color: scope.row.badge_color, fontSize: '28px' }"></i>
            </template>
        </el-table-column>
        <el-table-column label="工具key" prop="tool_key"></el-table-column>
        <el-table-column label="物种相关" width="100px" prop="species_related">
            <template #default="scope">
                <el-tag size="small" type="success" v-if="scope.row.is_species_related === 'T'">相关</el-tag>
                <el-tag size="small" type="warning" v-else>不相关</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="状态" width="100px" prop="show">
            <template #default="scope">
                <el-tag size="small" type="success" v-if="scope.row.is_show === 'T'">显示</el-tag>
                <el-tag size="small" type="warning" v-else>隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="100px">
            <template #default="scope">
                <router-link :to="{ path: '/tool/edit/', query: { id: scope.row.id } }">
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
        sortChange(row) {
            this.$util.post(this.api.toolSortChange, {id: row.id, sort: row.sort, platform: this.platform}, resp => {
                this.$message.success('保存成功')
                this.$emit('refresh')
            }, () => {
            })
        }
    }
}
</script>
