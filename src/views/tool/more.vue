<template>
    <el-dialog v-model="visible" append-to-body title="更多工具信息" width="1000px">
        <el-descriptions class="tool-list-description" :column="1" border>
            <el-descriptions-item label="工具图标">
                <el-image :src="data.icon_path" class="icon" style="height: 32px"></el-image>
            </el-descriptions-item>
            <el-descriptions-item label="工具名称">
                {{ data.tool_name }}
            </el-descriptions-item>
            <el-descriptions-item label="工具key">
                {{ data.tool_key }}
            </el-descriptions-item>
            <el-descriptions-item label="个数限制">
                {{ data.min }} - {{ data.max }}
            </el-descriptions-item>
            <el-descriptions-item label="工具介绍">
                {{ data.desc }}
            </el-descriptions-item>
            <el-descriptions-item label="注意事项">
                <div v-html="data.notice"></div>
            </el-descriptions-item>
            <el-descriptions-item label="参考引用">
                <div v-html="data.reference"></div>
            </el-descriptions-item>
            <el-descriptions-item label="方法描述">
                <div v-html="data.method_desc"></div>
            </el-descriptions-item>
            <el-descriptions-item label="结果说明">
                <div v-html="data.caption"></div>
            </el-descriptions-item>
            <el-descriptions-item label="物种相关">
                <el-tag size="small" type="success" v-if="data.is_species_related === 'T'"
                    >相关
                </el-tag>
                <el-tag size="small" type="warning" v-else>不相关</el-tag>
            </el-descriptions-item>
            <el-descriptions-item label="状态">
                <el-tag size="small" type="success" v-if="data.is_show === 'T'">显示</el-tag>
                <el-tag size="small" type="warning" v-else>隐藏</el-tag>
            </el-descriptions-item>
        </el-descriptions>
    </el-dialog>
</template>

<script>
export default {
    data() {
        return {
            visible: false,
            data: {}
        }
    },
    methods: {
        show(data) {
            this.data = data
            this.visible = true
        }
    }
}
</script>
