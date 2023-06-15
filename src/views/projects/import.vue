<template>
    <el-button type="primary" plain @click="visible = true">
        <i class="iconfont icon-import"></i> 导入
    </el-button>
    <el-dialog
        v-model="visible"
        append-to-body
        title="导入数据"
        width="1300px">
        导入数据
        <i class="iconfont icon-import"></i>
    </el-dialog>
</template>
<script>
export default {
    props: ['id'],
    data() {
        return {
            visible: false
        }
    },
    methods: {
        /**
         * 重新导入
         * @param row
         */
        reImport(row) {
            this.$confirm('确定要重新导入该项目数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let id = row.id
                this.$util.post(this.api.projectImport, {id}, () => {
                    this.$message.success('操作成功')
                    this.$emit('freshData')
                    this.visible = false
                })
            }).catch(() => {
            })
        }
    }
}
</script>
