<template>
  <div class="tool">
    <page-header description="新建工具需要手动操作,请联系开发人员" has-bread :image="image" />
    <el-card header="筛选条件" style="margin-bottom: 10px;" shadow="hover">
      <el-form label-position="left" label-width="120px">
        <el-form-item label="状态">
          <el-radio-group v-model="form.state" @change="filterChange">
            <el-radio :label="1">正常</el-radio>
            <el-radio :label="0">隐藏</el-radio>
          </el-radio-group>
        </el-form-item>
        <el-form-item label="类型">
          <el-radio-group v-model="form.type" @change="filterChange">
            <template v-if="platform === SINGLE_CELL_DATA">
              <el-radio :label="DATA_TYPE.cell">细胞</el-radio>
              <el-radio :label="DATA_TYPE.gene">基因</el-radio>
            </template>
            <template v-if="platform === SPATIAL_DATA">
              <el-radio :label="DATA_TYPE.stCell">空间位点</el-radio>
              <el-radio :label="DATA_TYPE.stGene">空间基因</el-radio>
            </template>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </el-card>
    <el-card :header="'工具列表 (共: ' + total + ' 个工具)'" class="tool" shadow="hover">
      <toolList :data="toolListFilter" :platform="platform" @refresh="fetchData" v-loading="loading"></toolList>
    </el-card>
  </div>
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
import {DATA_TYPE, SINGLE_CELL_DATA, SPATIAL_DATA} from "@/config/app";
import {getLocalStorage, setLocalStorage} from "@/libs/storage";
export default {
  props: ['platform'],
  components: {
    toolList,
    PageHeader
  },
  data () {
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
        state: params ? params.state : 1,
        type: params ? params.type : (this.platform === SPATIAL_DATA ? DATA_TYPE.stCell : DATA_TYPE.cell)
      },
      SINGLE_CELL_DATA,
      SPATIAL_DATA,
      DATA_TYPE,
      toolList: []
    }
  },
  computed: {
    toolListFilter () {
      const form = this.form
      return this.toolList.filter(item => {
        return item.show === form.state && item.data_type === form.type
      })
    },
    storageKey () {
      return `${this.platform}_tool_params`
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const platform = this.platform
      this.$util.get(this.api.tool, { platform }, resp => {
        this.toolList = resp
        this.total = resp.length
        this.loading = false
        this.filterChange()
      }, () => {
        this.loading = false
      })
    },
    filterChange () {
      setLocalStorage(this.storageKey, JSON.stringify(this.form))
    }
  },
  created () {
    this.fetchData()
  }
}
</script>
