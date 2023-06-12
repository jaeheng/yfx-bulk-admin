<template>
  <div class="geneset-category">
    <page-header description="可对公共数据库进行管理" :image="image">
      <el-button type="primary" plain @click="$refs.createDialog.show()"> <i class="iconfont icon-plus"></i> 新建公共数据库</el-button>
    </page-header>
    <el-card shadow="hover">
      <div v-if="speciesLoading">loading species...</div>
      <el-radio-group v-model="species" @change="currentChange(1)">
        <el-radio-button v-for="item in speciesList" :label="item.id" :key="item.id">{{ item.alias }}</el-radio-button>
      </el-radio-group>
    </el-card>
    <el-empty v-if="list.length === 0 && !loading && !speciesLoading"></el-empty>

    <el-row type="flex" :gutter="15" class="category-list" v-loading="loading">
      <el-col v-for="item in list" :key="item.id" :span="6">
        <el-card :body-style="{ padding: '0px' }" shadow="hover" class="category-item">
          <div style="padding: 14px;">
            <h3>{{ item.category_name }} <el-tag size="small" type="danger" v-if="item.deleted_at">已删除</el-tag></h3>
            <div class="info">
              <span>版本: v{{ item.version }}</span> <br>
              <span>物种: {{ item.species_text }}</span> <br>
              <time class="time">创建: {{ item.created_at }}</time> <br>
              <time class="time">更新: {{ item.updated_at }}</time>
            </div>
            <p class="desc">{{ item.category_desc }}</p>
          </div>
          <div class="bottom clearfix">
            <div class="button" @click="showGenesets(item)">基因集</div>
            <div class="button" @click="$refs.createDialog.show(item)">编辑</div>
            <div class="button" @click="deleteHandler(item)">{{ item.deleted_at ? '恢复' : '删除' }}</div>
          </div>
        </el-card>
      </el-col>
    </el-row>

    <el-pagination
        background
        :layout="PAGE_LAYOUT"
        :total="total"
        :page-size="PAGE_SIZE"
        hide-on-single-page
        @current-change="currentChange">
    </el-pagination>

    <create ref="createDialog" @success="fetchData"></create>
    <genesets ref="genesets"></genesets>
  </div>
</template>
<style lang="scss">
.category-list {
  min-height: 100px;
}
.geneset-category {
  padding-bottom: 50px;
}
</style>
<script>
import create from './create.vue'
import genesets from './genesets.vue'
import { geneSetCategoryDelete } from '@/request/modules/geneSetCategory'
import PageHeader from '_c/PageHeader.vue'
import { PAGE_LAYOUT, PAGE_SIZE } from '@/config/app'
import image from '@img/genesets.png'
import {getSpeciesList} from "@/request/modules/species";
export default {
  components: {
    create,
    genesets,
    PageHeader
  },
  data () {
    return {
      list: [],
      total: 0,
      page: 1,
      loading: false,
      species: '',
      PAGE_LAYOUT,
      PAGE_SIZE,
      image,
      speciesList: [],
      speciesLoading: false
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      const species = [this.species]
      const page = this.page
      this.$util.get(this.api.geneSetCategory, { species, page }, resp => {
        this.list = resp.list || []
        this.total = resp.total || 0
        this.loading = false
      }, () => {
        this.loading = false
      })
    },
    deleteHandler (item) {
      const text = item.deleted_at ? '恢复' : '删除'
      this.$confirm(`确定${text}基因集分类【${item.category_name}】?`, {}).then(() => {
        const id = item.id
        geneSetCategoryDelete({ id }).then(resp => {
          this.$message.success('操作成功')
          this.fetchData()
        }).catch(() => {})
      })
    },
    showGenesets (item) {
      this.$refs.genesets.show(item)
    },
    currentChange (page) {
      this.page = page
      this.fetchData()
    },
    getSpeciesList () {
      return new Promise((resolve, reject) => {
        this.speciesLoading = true
        getSpeciesList({}).then(resp => {
          console.log(resp)
          this.speciesList = resp
          this.speciesLoading = false
          if (resp[0]) {
            this.species = resp[0].id
          }
          resolve()
        }).catch(() => {
          this.speciesLoading = false
          reject()
        })
      })
    }
  },
  created () {
    this.getSpeciesList().then(this.fetchData)
  }
}
</script>
