<template>
    <div class="project-import">
        <div class="container">
            <BreadCrumb />
            <el-card shadow="never" class="project-import-header" style="margin-bottom: 16px">
                <el-page-header @back="$router.back()">
                    <template #content>
                        <span class="text-large font-600 mr-3"
                            >项目 {{ info.project }} 导入数据
                        </span>
                    </template>
                </el-page-header>
            </el-card>
            <el-row :gutter="16" style="margin-bottom: 16px">
                <el-col :span="12">
                    <el-card shadow="never" header="填写矩阵文件路径导入">
                        <import-path :id="id" />
                    </el-card>
                </el-col>
                <el-col :span="12">
                    <el-card shadow="never" header="导入记录">
                        <import-log :id="id" />
                    </el-card>
                </el-col>
            </el-row>
        </div>
    </div>
</template>

<style>
.project-import {
    padding-top: 15px;
}

.project-import-header {
    .el-page-header__breadcrumb {
        display: none;
    }
}
</style>

<script>
import BreadCrumb from '_c/BreadCrumb.vue'
import ImportPath from './import-path.vue'
import ImportLog from './import-log.vue'
import { getProjectInfo } from '@/request/modules/project'

export default {
    components: { BreadCrumb, ImportPath, ImportLog },
    data() {
        return {
            id: this.$route.params.id,
            loading: false,
            info: {}
        }
    },
    methods: {
        fetchData() {
            let id = this.id
            this.loading = true
            getProjectInfo(id)
                .then((resp) => {
                    this.info = resp
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
