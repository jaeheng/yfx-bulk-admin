<template>
    <el-table :data="list">
        <el-table-column
            :label="v.toUpperCase()"
            :property="v"
            v-for="v in columns"
        ></el-table-column>
    </el-table>
</template>

<script>
import { indexFieldsPublic } from '@/request/modules/statistic'

export default {
    data() {
        return {
            list: [],
            loading: false,
            columns: [
                'id',
                'name',
                'alias',
                'is_show',
                'annotation_id',
                'type',
                'created_at',
                'updated_at',
                'deleted_at'
            ]
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            indexFieldsPublic({})
                .then((resp) => {
                    this.list = resp
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        }
    },
    mounted() {
        this.fetchData()
    }
}
</script>
