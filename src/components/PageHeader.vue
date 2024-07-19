<template>
    <div class="page-header">
        <el-breadcrumb separator="/" v-if="hasBread" style="margin-bottom: 15px">
            <el-breadcrumb-item :to="{ name: 'dashboard' }">首页</el-breadcrumb-item>
            <template v-if="$route.meta.bread && $route.meta.bread.length > 0">
                <el-breadcrumb-item v-for="item in $route.meta.bread" :to="{ name: item.name }"
                    >{{ item.title }}
                </el-breadcrumb-item>
            </template>
            <el-breadcrumb-item>{{ title }}</el-breadcrumb-item>
        </el-breadcrumb>
        <h3 class="title">{{ title }}</h3>
        <p class="description">{{ description }}</p>
        <img :src="image" v-if="image" class="image" :alt="title" />
        <slot></slot>
    </div>
</template>
<style lang="scss">
.page-header {
    padding: 35px 400px 35px 35px;
    background: #fff;
    margin-bottom: 15px;
    position: relative;

    .title {
        margin: 0;
    }

    .description {
        font-size: 13px;
        color: #999;
    }

    .image {
        position: absolute;
        bottom: 10px;
        right: 100px;
        height: 61.8%;
    }
}
</style>

<script>
export default {
    props: {
        hasBread: {
            default: true,
            type: Boolean
        },
        description: {
            default: '',
            type: String
        },
        image: {
            default: '',
            type: String
        }
    },
    data() {
        return {
            title: this.$route.meta.title
        }
    }
}
</script>
