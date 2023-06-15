<template>
    <div class="project-import">
        <BreadCrumb/>
        <el-row :gutter="16" style="margin-bottom: 16px;">
            <el-col :span="12">
                <el-card shadow="never" header="填写矩阵文件路径导入">
                    <import-path :id="id"/>
                </el-card>
            </el-col>
            <el-col :span="12">
                <el-card shadow="never" header="上传矩阵文件导入">
                    <import-upload :id="id"/>
                </el-card>
            </el-col>
        </el-row>
        <el-card shadow="never" header="导入记录">
            <import-log :id="id"/>
        </el-card>
    </div>
</template>
<script>
import BreadCrumb from "_c/BreadCrumb.vue";
import ImportPath from './import-path.vue'
import ImportUpload from "./import-upload.vue";
import ImportLog from "./import-log.vue";

export default {
    components: {ImportUpload, BreadCrumb, ImportPath, ImportLog},
    data() {
        return {
            id: this.$route.params.id
        }
    }
}
</script>
