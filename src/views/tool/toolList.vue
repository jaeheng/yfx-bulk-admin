<template>
    <el-table class="tool-list" :data="data" size="small">
        <el-table-column label="ID" prop="id" width="80"></el-table-column>
        <el-table-column label="排序" width="100">
            <template #default="scope">
                <el-input
                    v-model="scope.row.sort"
                    type="number"
                    @change="sortChange(scope.row)"
                    size="small"
                    style="width: 50px"
                ></el-input>
            </template>
        </el-table-column>
        <el-table-column label="图标" width="100">
            <template #default="scope">
                <el-image :src="scope.row.icon_path" class="icon" style="height: 32px"></el-image>
            </template>
        </el-table-column>
        <el-table-column label="工具名称" prop="tool_name" show-overflow-tooltip>
            <template #default="scope">
                {{ scope.row.tool_name }}

                <template v-if="colorPresets[scope.row.badge_color]">
                    <i
                        class="ant-tag"
                        :style="{
                            color: colorPresets[scope.row.badge_color].color,
                            background: colorPresets[scope.row.badge_color]['background-color']
                        }"
                        >{{ scope.row.badge }}</i
                    >
                </template>
            </template>
        </el-table-column>
        <el-table-column label="工具key" prop="tool_key"></el-table-column>
        <el-table-column label="个数限制">
            <template #default="scope"> {{ scope.row.min }}-{{ scope.row.max }}</template>
        </el-table-column>
        <el-table-column label="物种相关" prop="species_related">
            <template #default="scope">
                <el-tag size="small" type="success" v-if="scope.row.is_species_related === 'T'"
                    >相关
                </el-tag>
                <el-tag size="small" type="warning" v-else>不相关</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="状态" prop="show">
            <template #default="scope">
                <el-tag size="small" type="success" v-if="scope.row.is_show === 'T'">显示</el-tag>
                <el-tag size="small" type="warning" v-else>隐藏</el-tag>
            </template>
        </el-table-column>
        <el-table-column label="操作" width="160px">
            <template #default="scope">
                <el-space>
                    <el-button type="primary" round size="small" @click="$refs.more.show(scope.row)"
                        >查看
                    </el-button>
                    <router-link :to="{ path: '/tool/edit/', query: { id: scope.row.id } }">
                        <el-button round size="small"
                            ><i class="iconfont icon-edit"></i>编辑
                        </el-button>
                    </router-link>
                </el-space>
            </template>
        </el-table-column>
    </el-table>

    <more ref="more"></more>
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
import { COLOR_PRESETS } from '@/config/app'
import more from './more.vue'

export default {
    props: ['data', 'platform'],
    components: {
        more
    },
    data() {
        const colorPresets = {}
        COLOR_PRESETS.map((item) => {
            colorPresets[item.class] = item
        })
        return {
            colorPresets: colorPresets
        }
    },
    methods: {
        sortChange(row) {
            this.$util.post(
                this.api.toolSortChange,
                { id: row.id, sort: row.sort, platform: this.platform },
                (resp) => {
                    this.$message.success('保存成功')
                    this.$emit('refresh')
                },
                () => {}
            )
        }
    }
}
</script>
