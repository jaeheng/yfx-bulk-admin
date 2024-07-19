<template>
    <el-breadcrumb
        separator="/"
        v-if="$route.meta.bread !== undefined"
        style="margin-bottom: 15px; margin-top: 15px"
    >
        <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
        <el-breadcrumb-item
            :to="{ name: item.name }"
            v-for="item in $route.meta.bread"
            :key="item.name"
            >{{ item.title }}
        </el-breadcrumb-item>
        <el-breadcrumb-item>{{ $route.meta.title }}</el-breadcrumb-item>
    </el-breadcrumb>
</template>
