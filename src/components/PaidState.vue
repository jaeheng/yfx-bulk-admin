<template>
    <template v-if="isPaid === 'T'">
        <el-tooltip placement="top">
            <el-tag size="small" type="warning" v-if="isDue">已过期</el-tag>
            <el-tag size="small" type="success" v-else>已付费</el-tag>
            <template v-slot:content>
                <span>{{ dueDateText }}到期</span>
            </template>
        </el-tooltip>
    </template>
    <template v-else>
        <el-tag size="small" type="warning">未付费</el-tag>
    </template>
</template>
<script>
import {dateFmt} from "@/libs/functions";

export default {
    props: {
        isPaid: {
            default: 'F',
            validate: (a) => {
                return ['T', 'F'].includes(a)
            }
        },
        dueDate: {
            default: '',
            type: Number
        }
    },
    computed: {
        dueDateText() {
            return this.dateFmt(this.dueDate)
        },
        isDue() {
            return (new Date()).getTime() / 1000 - this.dueDate > 0
        }
    },
    methods: {
        dateFmt(second) {
            return dateFmt(second)
        }
    }
}
</script>
