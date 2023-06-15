<template>
    <BreadCrumb/>
    <p>当前查看的是 <strong
        style="border-bottom: 1px dashed #ccc;color: #0090ff;padding-bottom: 5px;padding-left: 10px;padding-right: 10px;">{{ username }}</strong>
        的属性表字段</p>
    <el-radio-group v-model="type" size="large">
        <el-radio-button :label="0">单细胞-细胞表</el-radio-button>
        <el-radio-button :label="1">单细胞-基因表</el-radio-button>
        <el-radio-button :label="2">空间-空间位点表</el-radio-button>
        <el-radio-button :label="3">空间-空间基因表</el-radio-button>
    </el-radio-group>
    <el-card header="字段列表" style="margin-top: 15px;" shadow="hover">
        <el-table :data="fieldList">
            <el-table-column prop="id" label="ID" width="80"></el-table-column>
            <el-table-column prop="name" label="字段名" show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="key" label="key" show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="alias" label="别名" show-tooltip-when-overflow></el-table-column>
            <el-table-column prop="able_copy" label="能否复制">
                <template #default="scope">
                    <el-tag size="small" type="warning" v-if="scope.row.able_copy">能</el-tag>
                    <el-tag size="small" type="success" v-else>不能</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="is_copy" label="是否为复制列">
                <template #default="scope">
                    <el-tag size="small" type="warning" v-if="scope.row.is_copy">是</el-tag>
                    <el-tag size="small" type="success" v-else>否</el-tag>
                </template>
            </el-table-column>
            <el-table-column prop="copy_count" label="复制次数"></el-table-column>
            <el-table-column prop="type" label="数据类型"></el-table-column>
            <el-table-column prop="category.category_name" label="分类"></el-table-column>
            <el-table-column prop="is_show" label="默认显示">
                <template #default="scope">
                    <el-tag size="small" type="warning" v-if="scope.row.is_show">是</el-tag>
                    <el-tag size="small" type="success" v-else>否</el-tag>
                </template>
            </el-table-column>
        </el-table>
    </el-card>
</template>

<script>
import {getFieldList, getProjectInfo} from "@/request/modules/project";
import BreadCrumb from "_c/BreadCrumb.vue";
import {DATA_TYPE} from "@/config/app";

export default {
    components: {
        BreadCrumb
    },
    data() {
        return {
            id: this.$route.params.id,
            sc: [],
            st: [],
            type: 0,
            username: ''
        }
    },
    computed: {
        fieldList() {
            if (this.type === 0) {
                return this.sc.filter(item => item.data_type === DATA_TYPE.cell).sort((a, b) => a.category_id - b.category_id)
            }
            if (this.type === 1) {
                return this.sc.filter(item => item.data_type === DATA_TYPE.gene)
            }
            if (this.type === 2) {
                return this.st.filter(item => item.data_type === DATA_TYPE.stCell)
            }
            if (this.type === 3) {
                return this.st.filter(item => item.data_type === DATA_TYPE.stGene)
            }
            return []
        }
    },
    methods: {
        fetchData() {
            getFieldList(this.id).then(({sc, st}) => {
                this.sc = sc
                this.st = st
            })
        },
        fetchProject() {
            getProjectInfo(this.id).then(resp => {
                console.log(resp)
                this.username = resp.username
            })
        }
    },
    created() {
        this.fetchProject()
        this.fetchData()
    }
}
</script>
