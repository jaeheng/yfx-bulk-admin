<template>
    <div class="species">
        <page-header description="对物种信息、注释库信息进行统一管理" has-bread :image="image" />
        <el-card shadow="never">
            <el-form inline>
                <el-form-item style="margin-bottom: 0">
                    <el-button type="primary" @click="$refs.create.show()"
                        ><i class="iconfont icon-plus"></i> 新建物种
                    </el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <el-empty description="暂无物种数据" v-if="list.length === 0 && !loading"></el-empty>
        <el-row type="flex" :gutter="15" class="category-list" v-loading="loading">
            <el-col v-for="item in list" :key="item.id" :span="6">
                <el-card shadow="never" :body-style="{ padding: '0px' }" class="category-item">
                    <div style="padding: 14px">
                        <h3>{{ item.alias }} （{{ item.name }}）</h3>
                        <div class="info">
                            <span>taxid: {{ item.taxid }}</span> <br />
                            <time class="time">创建: {{ item.created_at }}</time>
                            <br />
                            <time class="time">更新: {{ item.updated_at }}</time>
                        </div>
                    </div>
                    <div class="bottom clearfix">
                        <div class="button" @click="$refs.annotationRef.show(item)">
                            <i class="iconfont icon-sample"></i>注释库
                        </div>
                        <div class="button" @click="$refs.create.show(item)">编辑</div>
                        <div class="button" @click="deleteHandler(item)">删除</div>
                    </div>
                </el-card>
            </el-col>
        </el-row>

        <Create ref="create" @success="fetchData"></Create>
        <AnnotationBox ref="annotationRef"></AnnotationBox>
    </div>
</template>
<script>
import { deleteSpecies, getSpeciesList } from '@/request/modules/species'
import PageHeader from '_c/PageHeader.vue'
import Create from './create.vue'
import Annotation from './annotation.vue'
import image from '@img/species.svg'

export default {
    data() {
        return {
            loading: false,
            list: [],
            image
        }
    },
    components: {
        PageHeader,
        Create,
        AnnotationBox: Annotation
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
