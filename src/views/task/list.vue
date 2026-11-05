<template>
    <div class="task">
        <page-header
            description="对系统任务进行查询、操作"
            has-bread
            :image="image"
            :hasBread="false"
        />
        <el-card class="border-less" header="搜索条件" shadow="never">
            <el-form :model="form" label-width="120px" label-position="left">
                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="所属项目:" class="full-width">
                            <div style="width: 370px">
                                <el-select
                                    v-model="form.uid"
                                    filterable
                                    remote
                                    clearable
                                    reserve-keyword
                                    placeholder="请输入关键词搜索所属项目"
                                    :remote-method="remoteMethod"
                                    :loading="uidLoading"
                                    remote-show-suffix
                                >
                                    <el-option
                                        v-for="item in options"
                                        :key="item.value"
                                        :label="item.label"
                                        :value="item.value"
                                    >
                                    </el-option>
                                </el-select>
                            </div>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="创建时间:" class="full-width">
                            <div>
                                <el-date-picker
                                    v-model="form.rangTime"
                                    type="daterange"
                                    unlink-panels
                                    range-separator="到"
                                    start-placeholder="开始时间"
                                    end-placeholder="结束时间"
                                    format="YYYY/MM/DD"
                                    value-format="YYYY-MM-DD"
                                    :shortcuts="shortcuts"
                                />
                            </div>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-row :gutter="15">
                    <el-col :span="12">
                        <el-form-item label="是否删除">
                            <el-radio-group v-model="form.deleted_at">
                                <el-radio value="all">全部</el-radio>
                                <el-radio value="N">否</el-radio>
                                <el-radio value="Y">是</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                    <el-col :span="12">
                        <el-form-item label="展示形式">
                            <el-radio-group v-model="form.displayType">
                                <el-radio value="normal">顺序</el-radio>
                                <el-radio value="tree">树形</el-radio>
                            </el-radio-group>
                        </el-form-item>
                    </el-col>
                </el-row>

                <el-form-item label="状态筛选">
                    <el-radio-group v-model="form.state">
                        <el-radio value="">全部</el-radio>
                        <el-radio :value="-1">未开始</el-radio>
                        <el-radio :value="0">进行中</el-radio>
                        <el-radio :value="1">成功</el-radio>
                        <el-radio :value="2">失败</el-radio>
                        <el-radio :value="3">写入中</el-radio>
                    </el-radio-group>
                </el-form-item>

                <el-form-item label="分析工具">
                    <el-select
                        v-model="form.tool_id"
                        placeholder="选择分析工具"
                        size="large"
                        style="width: 240px"
                    >
                        <el-option :value="0" label="所有工具" />
                        <el-option
                            v-for="item in tools"
                            :key="item.id"
                            :label="item.tool_name"
                            :value="item.id"
                        />
                    </el-select>
                </el-form-item>

                <el-form-item label="关键字:" class="full-width">
                    <el-input
                        class="search"
                        v-model="form.keyword"
                        @keyup.enter="search"
                        placeholder="请输入关键字"
                        clearable
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="search">搜索</el-button>
                </el-form-item>
            </el-form>
        </el-card>

        <el-card class="border-less" header="任务列表" shadow="never" style="margin-top: 10px">
            <el-table
                :data="tableData"
                v-loading="loading"
                size="small"
                row-key="id"
                default-expand-all
            >
                <el-table-column label="ID" prop="id" width="120" />
                <el-table-column label="任务名称" prop="task_name" />
                <el-table-column label="所属项目" prop="project.project" />
                <el-table-column label="分析工具" prop="tool.tool_name" />
                <el-table-column label="创建时间" prop="created_at" />
                <el-table-column label="状态" width="100">
                    <template #default="scope">
                        <div class="task-status">
                            <!-- -1未开始  0进行中  1成功 2 失败 3写入中 -->
                            <import-state :state="scope.row.state"
                                >{{ state[scope.row.state].text }}
                            </import-state>
                            <el-tooltip
                                v-if="scope.row.deleted_at"
                                content="已删除"
                                placement="top"
                            >
                                <el-icon class="deleted-icon" aria-label="已删除">
                                    <Delete />
                                </el-icon>
                            </el-tooltip>
                        </div>
                    </template>
                </el-table-column>
                <el-table-column label="运行状态" width="100">
                    <template #default="scope">
                        <task-state-button :id="scope.row.id" />
                    </template>
                </el-table-column>
                <el-table-column label="操作" width="100">
                    <template #default="scope">
                        <more :data="scope.row"></more>
                    </template>
                </el-table-column>
            </el-table>

            <el-pagination
                background
                :layout="PAGE_LAYOUT"
                :total="total"
                :page-size="perPage"
                v-model:currentPage="page"
                @current-change="currentChange"
            >
            </el-pagination>
        </el-card>
    </div>
</template>

<style lang="scss">
.task {
    padding-bottom: 50px;

    .el-form-item--large {
        margin-bottom: 5px;
    }

    .task-status {
        display: flex;
        align-items: center;
        gap: 6px;
        white-space: nowrap;
    }

    .deleted-icon {
        color: #909399;
        font-size: 14px;
    }
}
</style>

<script>
import PageHeader from '_c/PageHeader.vue'
import more from '_c/TaskMore.vue'
import image from '@img/task.png'
import { PAGE_LAYOUT, TASK_STATE } from '@/config/app'
import ImportState from '_c/ImportState.vue'
import { taskList } from '@/request/modules/task'
import { getToolList } from '@/request/modules/tool'
import TaskStateButton from '_c/taskStateButton.vue'
import { Delete } from '@element-plus/icons-vue'

export default {
    components: {
        Delete,
        TaskStateButton,
        PageHeader,
        more,
        ImportState
    },
    data() {
        return {
            image,
            total: 0,
            page: 1,
            tableData: [],
            perPage: 15,
            PAGE_LAYOUT,
            dataType: this.$appConfig.dataType,
            loading: false,
            form: {
                keyword: '',
                state: '',
                tool_id: 0,
                uid: '',
                displayType: 'normal',
                rangTime: [],
                deleted_at: 'all'
            },
            uidLoading: false,
            toolLoading: false,
            options: [],
            state: TASK_STATE,
            tools: [],
            loadingTool: false,
            shortcuts: [
                {
                    text: '最近一周',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 7)
                        return [start, end]
                    }
                },
                {
                    text: '最近一月',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 30)
                        return [start, end]
                    }
                },
                {
                    text: '最近三月',
                    value: () => {
                        const end = new Date()
                        const start = new Date()
                        start.setTime(start.getTime() - 3600 * 1000 * 24 * 90)
                        return [start, end]
                    }
                }
            ]
        }
    },
    methods: {
        /**
         * 搜索
         */
        search() {
            this.currentChange(1)
        },
        /**
         * 翻页
         */
        currentChange(page) {
            this.page = page
            this.fetchData()
        },
        fetchData() {
            let page = this.page
            let form = this.form
            this.loading = true
            taskList({ page, ...form })
                .then((resp) => {
                    this.tableData = resp.list || []
                    this.total = resp.total || 0
                    this.perPage = resp.perPage || 15
                    this.loading = false
                })
                .catch(() => {
                    this.loading = false
                })
        },
        remoteMethod(query) {
            if (query) {
                let page = 1
                this.uidLoading = true
                this.$util.get(
                    this.api.project,
                    { page, keyword: query },
                    (resp) => {
                        if (resp.list) {
                            this.options = resp.list.map((item) => {
                                return {
                                    value: item.id,
                                    label: item.project
                                }
                            })
                        } else {
                            this.options = []
                        }
                        this.uidLoading = false
                    },
                    () => {
                        this.uidLoading = false
                    }
                )
            }
        },
        fetchTools() {
            this.loadingTool = false

            getToolList()
                .then((resp) => {
                    this.tools = resp
                    this.loadingTool = false
                })
                .catch(() => {
                    this.loadingTool = false
                })
        }
    },
    mounted() {
        this.fetchData()
        this.fetchTools()
    }
}
</script>
