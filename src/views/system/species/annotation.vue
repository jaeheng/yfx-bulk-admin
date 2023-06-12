<template>
  <el-drawer v-model="visible" custom-class="annotation" title="注释库" size="500px">
    <el-alert type="warning">以下为物种 "<strong>{{ info.alias }}</strong>" 关联的注释库</el-alert>
    <div class="category-list" v-loading="loading">
      <el-card shadow="hover" :body-style="{ padding: '0px' }" class="category-item" v-for="item in list" :key="item.id">
        <div style="padding: 14px;">
          <h3>{{ item.name }}</h3>
          <div class="info">
            <div><span>ID:</span> {{ item.id }}</div>
            <div><span>维护者:</span> {{ item.maintainer }}</div>
            <div class="time"><span>创建时间:</span> {{ item.created_at }}</div>
            <div class="time"><span>更新时间:</span> {{ item.updated_at }}</div>
            <div class="desc"><span>描述:</span> {{ item.description }}</div>
            <div><span>存储目录:</span><code>{{ item.library_path }}</code></div>
          </div>
        </div>
        <div class="bottom clearfix">
          <div class="button" @click="$refs.json.show(item)">详细信息</div>
          <div class="button" @click="$refs.create.show(info.id, item)">编辑</div>
        </div>
      </el-card>
      <el-card shadow="hover" :body-style="{ padding: '0px' }" class="category-item" style="padding-bottom: 0;">
        <div style="padding: 30px 0;text-align: center;cursor: pointer;background: #f4f4f5;" @click="$refs.create.show(info.id)">
          <i class="iconfont icon-plus"></i>
          新建注释库
        </div>
      </el-card>
    </div>

    <DatabaseJson ref="json"></DatabaseJson>
    <AnnotationCreate ref="create" @success="fetchData"></AnnotationCreate>
  </el-drawer>
</template>
<style lang="scss">
.annotation {
  .category-item {
    margin-bottom: 10px;
    .info {
      font-size: 12px;
      span {
        display: inline-block;
        width: 70px;
        text-align: right;
      }
    }
  }
}
</style>
<script>
import DatabaseJson from './databaseJson.vue'
import AnnotationCreate from './annotationCreate.vue'
import {getAnnotationList} from '@/request/modules/species'
import {ANNOTATION_PREFIX} from '@/config/app'
export default {
  name: 'annotation',
  components: {
    DatabaseJson,
    AnnotationCreate
  },
  data () {
    return {
      visible: false,
      info: {},
      list: [],
      loading: false,
      ANNOTATION_PREFIX
    }
  },
  methods: {
    fetchData () {
      this.loading = true
      getAnnotationList({ species_id: this.info.id }).then(resp => {
        console.log(resp)
        this.list = resp
        this.loading = false
      }).catch(() => {
        this.loading = false
      })
    },
    show (row) {
      this.info = row
      this.visible = true
      this.fetchData()
    }
  }
}
</script>
