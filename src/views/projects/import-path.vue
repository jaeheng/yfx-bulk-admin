<template>
    <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="150px">
        <el-form-item label="counts矩阵路径:" prop="counts">
            <el-input v-model="form.counts" placeholder="请输入counts矩阵的绝对路径"></el-input>
        </el-form-item>
        <el-form-item label="normalized矩阵路径:" prop="normalized">
            <el-input
                v-model="form.normalized"
                placeholder="请输入normalized矩阵的绝对路径"
            ></el-input>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="submitting" @click="submit">导入数据</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import { MATRIX_TYPE } from '@/config/app'
import { importFromPath } from '@/request/modules/project'
import { ElMessageBox } from 'element-plus'

export default {
    props: ['id'],
    data() {
        return {
            MATRIX_TYPE,
            form: {
                counts: '/Users/zhangjiawei/YFX_BULK/c.xls',
                normalized: '/Users/zhangjiawei/YFX_BULK/n.xls'
            },
            rules: {
                counts: [{ required: true, message: '请输入counts矩阵路径', trigger: 'blur' }]
            },
            submitting: false
        }
    },
    methods: {
        submit() {
            this.$refs.form.validate((valid) => {
                if (valid) {
                    ElMessageBox.confirm('确认导入数据? 导入后将清空该账号的旧数据', '请确认', {
                        type: 'warning'
                    })
                        .then(() => {
                            this.submitting = true
                            importFromPath({ id: this.id, ...this.form })
                                .then(() => {
                                    this.$message.success('导入成功,请测试项目数据是否正常')
                                    this.submitting = false
                                })
                                .catch(() => {
                                    this.submitting = false
                                })
                        })
                        .catch(() => {})
                }
            })
        }
    }
}
</script>
