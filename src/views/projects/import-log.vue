<template>
    <div class="import-log">
        <el-table :data="list">
            <el-table-column label="ID" prop="id"></el-table-column>
            <el-table-column label="文件名" prop="origin_name"></el-table-column>
        </el-table>
    </div>
</template>

<script>
import {importLog} from "@/request/modules/project";
import {PAGE_SIZE} from "@/config/app";

export default {
    props: ['id'],
    data() {
        return {
            loading: false,
            list: [],
            page: 1,
            total: 0,
            pageSize: PAGE_SIZE
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            importLog(this.id, this.page).then(resp => {
                this.list = resp.list
                this.total = resp.total
                this.pageSize = resp.pageSize
                this.loading = false
            }).catch(() => {
                this.loading = false
            })
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
