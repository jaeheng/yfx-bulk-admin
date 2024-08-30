<template>
    <el-container class="statistic">
        <el-aside width="220px">
            <el-menu
                :default-active="$route.fullPath"
                class="el-menu-vertical-demo"
                :collapse="isCollapse"
                :router="true"
            >
                <el-menu-item index="/task/list">
                    <el-icon>
                        <Finished />
                    </el-icon>
                    <template #title>任务列表</template>
                </el-menu-item>
                <el-menu-item index="/task/queue">
                    <el-icon>
                        <WindPower />
                    </el-icon>
                    <template #title>运行的队列</template>
                </el-menu-item>
                <el-menu-item index="/task/queue-failed">
                    <el-icon>
                        <CircleClose />
                    </el-icon>
                    <template #title>失败的队列</template>
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
import { Finished, WindPower, CircleClose } from '@element-plus/icons-vue'
</script>
<script>
import { mapGetters } from 'vuex'

export default {
    computed: {
        ...mapGetters({
            isCollapse: 'system/menuCollapse'
        })
    }
}
</script>
