<template>
    <el-container class="projects">
        <el-aside width="220px">
            <el-menu
                :default-active="$route.fullPath"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                :router="true"
            >
                <el-menu-item index="/sets/public-gene-set">
                    <el-icon><i class="el-icon iconfont icon-gene"></i></el-icon>
                    <template #title>公共基因集</template>
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
import {User} from "@element-plus/icons-vue";
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
