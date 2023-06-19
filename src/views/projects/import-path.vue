<template>
    <el-form :model="form" :rules="rules" ref="form" label-position="left" label-width="120px">
        <el-form-item label="矩阵路径:" prop="path">
            <el-input v-model="form.path" placeholder="请输入矩阵的绝对路径"></el-input>
        </el-form-item>
        <el-form-item label="矩阵类型:" prop="type">
            <el-radio-group v-model="form.type">
                <el-radio v-for="key of MATRIX_TYPE" :key="key" :label="key">{{ MATRIX_TYPE[key] }}</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item>
            <el-button type="primary" :loading="submitting" @click="submit">导入数据</el-button>
        </el-form-item>
    </el-form>
</template>

<script>
import {MATRIX_TYPE} from "@/config/app";
import {importFromPath} from "@/request/modules/project";

export default {
    props: ['id'],
    data() {
        return {
            MATRIX_TYPE,
            form: {
                path: '/Users/zhangjiawei/YFX_BULK/exp.xls',
                type: 'counts' // counts/normalized
            },
            rules: {
                path: [
                    {required: true, message: '请输入矩阵路径', trigger: 'blur'}
                ],
                type: [
                    {required: true, message: '请选择矩阵类型', trigger: 'blur'}
                ]
            },
            submitting: false
        }
    },
    methods: {
        submit() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    console.log(this.form)
                    this.submitting = true
                    importFromPath({id: this.id, ...this.form}).then(() => {
                        this.$message.success('导入成功,请测试项目数据是否正常')
                        this.submitting = false
                    }).catch(() => {
                        this.submitting = false
                    })
                }
            })
        }
    }
}
</script>
