<template>
  <el-container class="accounts">
    <el-aside width="220px">
      <el-menu
          :default-active="$route.fullPath"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
      >
        <el-menu-item index="/accounts/list">
          <el-icon><User /></el-icon>
          <template #title>账号列表</template>
        </el-menu-item>
        <el-menu-item index="/accounts/deleted">
          <el-icon><DeleteFilled /></el-icon>
          <template #title>已删除账号</template>
        </el-menu-item>
        <el-menu-item index="/accounts/manages">
          <el-icon><UserFilled /></el-icon>
          <template #title>客户管理员</template>
        </el-menu-item>
        <el-menu-item index="/accounts/company">
          <el-icon><Suitcase /></el-icon>
          <template #title>公司管理</template>
        </el-menu-item>
        <el-menu-item index="/accounts/pass">
          <el-icon><Finished /></el-icon>
          <template #title>试用申请</template>
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
import { User, UserFilled, Suitcase, Finished, DeleteFilled } from "@element-plus/icons-vue";
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
