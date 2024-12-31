<template>
    <Layout class="species">
        <page-header description="对物种信息、注释库信息进行统一管理" has-bread :image="image" />
        <el-card shadow="never" class="border-less">
            <el-form inline>
                <el-form-item style="margin-bottom: 0">
                    <el-button type="primary" @click="$refs.create.show()"
                        ><i class="iconfont icon-plus"></i> 新建物种
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-empty description="暂无物种数据" v-if="list.length === 0 && !loading"></el-empty>

        <el-tabs
            v-model="activeName"
            v-loading="loading"
            style="background: #fff; padding: 20px; margin-top: 15px"
        >
            <el-tab-pane :name="index" v-for="(item, index) in list" :key="item.id">
                <template #label>
                    <i
                        class="iconfont"
                        :class="`icon-${item.name}`"
                        style="font-size: 20px; margin-right: 5px"
                    ></i>
                    {{ item.alias }}
                </template>
                <el-card shadow="never" class="border-less" style="margin-top: 15px">
                    <div class="flex">
                        <div class="info">
                            <p>
                                <i
                                    class="iconfont"
                                    :class="`icon-${item.name}`"
                                    style="font-size: 50px"
                                ></i>
                            </p>
                            <p>
                                <strong>ID: {{ item.id }}</strong>
                            </p>
                            <p style="font-weight: bold">{{ item.alias }} ({{ item.name }})</p>
                            <p>TAXID: {{ item.taxid }}</p>
                            <p class="time">创建: {{ item.created_at }}</p>
                            <p class="time">更新: {{ item.updated_at }}</p>
                        </div>
                        <div>
                            <el-button type="primary" @click="$refs.annotationCreate.show(item.id)">
                                <i class="iconfont icon-plus"></i>
                                新建注释库
                            </el-button>
                            <el-button type="primary" plain @click="$refs.create.show(item)"
                                >编辑
                            </el-button>
                            <el-button @click="deleteHandler(item)">删除</el-button>
                        </div>
                    </div>
                </el-card>
                <el-card
                    style="margin-top: 15px"
                    shadow="never"
                    class="border-less"
                    header="注释库"
                >
                    <AnnotationBox
                        :annotation="item.annotation"
                        @success="fetchData"
                        :species_id="item.id"
                    ></AnnotationBox>
                </el-card>
            </el-tab-pane>
        </el-tabs>

        <Create ref="create" @success="fetchData"></Create>
        <AnnotationCreate ref="annotationCreate" @success="fetchData"></AnnotationCreate>
    </Layout>
</template>
<script>
import { deleteSpecies, getSpeciesList } from '@/request/modules/species'
import PageHeader from '_c/PageHeader.vue'
import Create from './create.vue'
import Annotation from './annotation.vue'
import image from '@img/species.svg'
import Layout from '_v/layouts/layout.vue'
import AnnotationCreate from '_v/species/annotationCreate.vue'

export default {
    data() {
        return {
            loading: false,
            list: [],
            image,
            activeName: 0
        }
    },
    components: {
        AnnotationCreate,
        PageHeader,
        Create,
        AnnotationBox: Annotation,
        Layout
    },
    methods: {
        fetchData() {
            this.loading = true
            getSpeciesList({})
                .then((resp) => {
                    this.list = resp
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        deleteHandler(row) {
            console.log(row)
            this.$confirm('确认删除该物种?', '请确认', {
                type: 'warning',
                confirmButtonText: '确认删除',
                cancelButtonText: '取消'
            }).then(() => {
                deleteSpecies(row.id)
                    .then((resp) => {
                        this.$message.success('成功删除!')
                        this.fetchData()
                    })
                    .catch(() => {})
            })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
