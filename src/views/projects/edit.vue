<template>
    <div class="projects-edit">
        <div class="container">
            <BreadCrumb />
            <el-card shadow="hover" header="修改项目">
                <project-form ref="projectForm" @submit="submitHandle" v-loading="loading" />
            </el-card>
        </div>
    </div>
</template>
<style>
.projects-edit {
    padding-top: 15px;
}
</style>
<script>
import BreadCrumb from '_c/BreadCrumb.vue'
import ProjectForm from '_v/projects/form.vue'
import { editProject, getProjectInfo } from '@/request/modules/project'

export default {
    components: { BreadCrumb, ProjectForm },
    data() {
        return {
            id: this.$route.params.id,
            loading: false
        }
    },
    methods: {
        fetchData() {
            let id = this.id
            this.loading = true
            getProjectInfo(id)
                .then((resp) => {
                    this.$refs.projectForm.setDefault(resp)
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        submitHandle(form) {
            editProject({ id: this.id, ...form })
                .then(() => {
                    this.$message.success('修改成功')
                    this.$refs.projectForm.submitSuccess()
                    this.$router.push('/projects')
                })
                .catch(() => {
                    this.$refs.projectForm.submitSuccess()
                })
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
