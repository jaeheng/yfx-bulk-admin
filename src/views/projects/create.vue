<template>
    <div class="projects-create">
        <div class="container">
            <BreadCrumb />
            <el-card shadow="never" header="创建项目">
                <project-form ref="projectForm" @submit="submitHandle" />
            </el-card>
        </div>
    </div>
</template>
<style>
.projects-create {
    padding-top: 15px;
}
</style>
<script>
import BreadCrumb from '_c/BreadCrumb.vue'
import ProjectForm from './form.vue'
import { createProject } from '@/request/modules/project'

export default {
    components: { BreadCrumb, ProjectForm },
    methods: {
        submitHandle(form) {
            createProject(form)
                .then(() => {
                    this.$router.push('/projects')
                    this.$message.success('创建项目成功')
                    this.$refs.projectForm.submitSuccess()
                })
                .catch(this.$refs.projectForm.submitSuccess)
        }
    }
}
</script>
