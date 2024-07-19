<template>
    <el-tag size="small" type="danger" v-if="state === 0">已禁用 </el-tag>
    <el-tag size="small" type="success" v-else>正常</el-tag>
</template>
<script>
export default {
    props: ['state']
}
</script>
