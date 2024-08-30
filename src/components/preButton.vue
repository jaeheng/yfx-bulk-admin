<template>
    <span>
        <el-button size="small" type="primary" round @click="visible = true">查看</el-button>
        <el-dialog append-to-body width="1300px" v-model="visible">
            <vue-json-pretty :data="JSON.parse(data)"></vue-json-pretty>
        </el-dialog>
    </span>
</template>

<script>
export default {
    props: ['data'],
    data() {
        return {
            visible: false
        }
    }
}
</script>
