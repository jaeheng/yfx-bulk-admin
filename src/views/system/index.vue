<template>
  <el-container class="system">
    <el-aside width="220px">
      <el-menu
          :default-active="$route.fullPath"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
      >
        <el-menu-item index="/system/ucenter">
          <el-icon><User /></el-icon>
          <template #title>个人信息</template>
        </el-menu-item>
        <el-menu-item index="/system/password">
          <el-icon><Lock /></el-icon>
          <template #title>修改密码</template>
        </el-menu-item>
        <el-menu-item index="/system/upgrade">
          <el-icon><Refresh /></el-icon>
          <template #title>更新记录</template>
        </el-menu-item>
        <el-menu-item index="/system/species">
          <el-icon><i class="iconfont icon-human"></i></el-icon>
          <template #title>物种管理</template>
        </el-menu-item>
        <el-menu-item index="/system/color-sets">
          <el-icon><i class="iconfont icon-color"></i></el-icon>
          <template #title>颜色集合</template>
        </el-menu-item>
      </el-menu>
    </el-aside>
    <el-container>
      <el-main>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>
<script setup>
import { User, Lock, Refresh } from "@element-plus/icons-vue";
</script>
<script>
import {mapGetters} from "vuex";

export default {
  computed: {
    ...mapGetters({
      isCollapse: 'system/menuCollapse'
    })
  }
}
</script>
