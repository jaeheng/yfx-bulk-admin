<template>
    <Layout class="tool">
        <page-header description="新建工具需要手动操作,请联系开发人员" has-bread :image="image" />
        <el-card class="border-less" style="margin-bottom: 10px" shadow="never">
            <el-form inline>
                <el-form-item label="状态:" style="margin-bottom: 0">
                    <el-radio-group v-model="form.state" @change="filterChange">
                        <el-radio value="T">正常</el-radio>
                        <el-radio value="F">隐藏</el-radio>
                    </el-radio-group>
                </el-form-item>
            </el-form>
        </el-card>
        <el-card
            class="border-less tool"
            :header="'工具列表 (共: ' + total + ' 个工具)'"
            shadow="never"
        >
            <toolList
                :data="toolListFilter"
                :platform="platform"
                @refresh="fetchData"
                v-loading="loading"
            ></toolList>
        </el-card>
    </Layout>
</template>
<style>
.tool {
    padding-bottom: 50px;
}
</style>

<script>
import toolList from './toolList.vue'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/tool.svg'
import { DATA_TYPE, SINGLE_CELL_DATA, SPATIAL_DATA } from '@/config/app'
import { getLocalStorage, setLocalStorage } from '@/libs/storage'
import { getToolList } from '@/request/modules/tool'
import Layout from '_v/layouts/layout.vue'

export default {
    props: ['platform'],
    components: {
        toolList,
        PageHeader,
        Layout
    },
    data() {
        let params = getLocalStorage(`${this.platform}_tool_params`)
        if (params) {
            params = JSON.parse(params)
        }
        console.log('params', params)
        return {
            loading: false,
            total: 0,
            image,
            form: {
                state: params ? params.state : 'T',
                type: params
                    ? params.type
                    : this.platform === SPATIAL_DATA
                      ? DATA_TYPE.stCell
                      : DATA_TYPE.cell
            },
            SINGLE_CELL_DATA,
            SPATIAL_DATA,
            DATA_TYPE,
            toolList: []
        }
    },
    computed: {
        toolListFilter() {
            const form = this.form
            return this.toolList.filter((item) => {
                return item.is_show === form.state
            })
        },
        storageKey() {
            return `${this.platform}_tool_params`
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            getToolList()
                .then((resp) => {
                    this.toolList = resp
                    this.total = resp.length
                    this.loading = false
                    this.filterChange()
                })
                .catch(() => {
                    this.loading = false
                })
        },
        filterChange() {
            setLocalStorage(this.storageKey, JSON.stringify(this.form))
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
