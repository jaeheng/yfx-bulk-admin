<template>
  <el-container>
    <el-aside width="220px">
      <el-menu
          :default-active="$route.fullPath"
          class="el-menu-vertical-demo"
          :collapse="isCollapse"
          :router="true"
      >
        <el-menu-item index="/tool/sc">
          <el-icon><User /></el-icon>
          <template #title>单细胞工具</template>
        </el-menu-item>
        <el-menu-item index="/tool/st">
          <el-icon><Lock /></el-icon>
          <template #title>空间工具</template>
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
import { User, Lock } from "@element-plus/icons-vue";
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
