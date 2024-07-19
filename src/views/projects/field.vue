<template>
    <div class="container">
        <BreadCrumb />
        <p>
            当前查看的是
            <strong
                style="
                    border-bottom: 1px dashed #ccc;
                    color: #0090ff;
                    padding-bottom: 5px;
                    padding-left: 10px;
                    padding-right: 10px;
                "
                >{{ project }}</strong
            >
            的属性表字段
        </p>
        <el-card header="字段列表" style="margin-top: 15px" shadow="hover">
            <el-table :data="fieldList">
                <el-table-column prop="id" label="ID" width="80"></el-table-column>
                <el-table-column
                    prop="name"
                    label="字段名"
                    show-tooltip-when-overflow
                ></el-table-column>

                <el-table-column
                    prop="alias"
                    label="别名"
                    show-tooltip-when-overflow
                ></el-table-column>
                <el-table-column prop="type" label="数据类型"></el-table-column>
                <el-table-column prop="sort" label="sort"></el-table-column>
                <el-table-column prop="created_at" label="创建时间"></el-table-column>
                <el-table-column prop="is_show" label="默认显示">
                    <template #default="scope">
                        <el-tag size="small" type="warning" v-if="scope.row.is_show === 'T'"
                            >是
                        </el-tag>
                        <el-tag size="small" type="success" v-else>否</el-tag>
                    </template>
                </el-table-column>
            </el-table>
        </el-card>
    </div>
</template>

<script>
import { getFieldList, getProjectInfo } from '@/request/modules/project'
import BreadCrumb from '_c/BreadCrumb.vue'

export default {
    components: {
        BreadCrumb
    },
    data() {
        return {
            id: this.$route.params.id,
            fieldList: [],
            project: ''
        }
    },
    methods: {
        fetchData() {
            getFieldList(this.id).then((resp) => {
                this.fieldList = resp
            })
        },
        fetchProject() {
            getProjectInfo(this.id).then((resp) => {
                console.log(resp)
                this.project = resp.project
            })
        }
    },
    created() {
        this.fetchProject()
        this.fetchData()
    }
}
</script>
