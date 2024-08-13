<template>
    <span>
        <el-button plain @click="visible = true">查看</el-button>
        <el-dialog v-model="visible" append-to-body title="项目详情" width="1300px">
            <el-row :gutter="20">
                <el-col :span="14">
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="付费状态">
                            <paid-state
                                :due-date="data.due_date"
                                :is-paid="data.is_paid"
                            ></paid-state>
                        </el-descriptions-item>
                        <el-descriptions-item label="YFX编号">{{
                            data.yfx_id
                        }}</el-descriptions-item>
                        <el-descriptions-item label="项目编号">{{
                            data.project
                        }}</el-descriptions-item>
                        <el-descriptions-item label="项目简介">{{
                            data.description
                        }}</el-descriptions-item>
                        <el-descriptions-item label="样本数">{{
                            data.sample_count
                        }}</el-descriptions-item>
                        <el-descriptions-item label="存储空间">{{
                            data.size
                        }}</el-descriptions-item>
                        <el-descriptions-item label="物种">{{
                            data.species.alias
                        }}</el-descriptions-item>
                        <el-descriptions-item label="注释库">{{
                            data.library.name
                        }}</el-descriptions-item>
                        <el-descriptions-item label="剩余任务数">{{
                            data.task_limit
                        }}</el-descriptions-item>
                        <el-descriptions-item label="所属公司">{{
                            data.company.name
                        }}</el-descriptions-item>
                        <el-descriptions-item label="联系人邮箱">{{
                            data.email
                        }}</el-descriptions-item>
                        <el-descriptions-item label="创建时间">{{
                            data.created_at
                        }}</el-descriptions-item>
                        <el-descriptions-item label="更新时间">{{
                            data.updated_at || '-'
                        }}</el-descriptions-item>
                        <el-descriptions-item label="删除时间">{{
                            data.deleted_at || '-'
                        }}</el-descriptions-item>
                        <el-descriptions-item label="data_path">{{
                            data.data_path || '-'
                        }}</el-descriptions-item>
                    </el-descriptions>
                </el-col>
                <el-col :span="10">
                    <el-descriptions :column="1" border>
                        <el-descriptions-item label="慎重操作">
                            <div style="white-space: nowrap">
                                <el-button type="danger" @click="rePwd(data)">重置密码</el-button>
                                <el-button
                                    :loading="emailSending"
                                    type="danger"
                                    @click="rePwdEmail(data)"
                                    >重置密码并发送邮件</el-button
                                >
                            </div>
                        </el-descriptions-item>
                        <el-descriptions-item label="表头配置">
                            <router-link :to="{ name: 'projectsField', params: { id: data.id } }">
                                <el-button type="warning" plain>
                                    <i class="iconfont icon-select"></i> 表头配置
                                </el-button>
                            </router-link>
                        </el-descriptions-item>
                    </el-descriptions>
                </el-col>
            </el-row>
        </el-dialog>
    </span>
</template>

<script>
import { SINGLE_CELL_DATA, SPATIAL_DATA } from '@/config/app'
import { dateFmt } from '@/libs/functions'
import ImportState from '_c/ImportState.vue'
import PaidState from '_c/PaidState.vue'

export default {
    props: ['data'],
    emits: ['freshData'],
    components: {
        ImportState,
        PaidState
    },
    data() {
        return {
            emailSending: false,
            visible: false,
            SINGLE_CELL_DATA,
            SPATIAL_DATA,
            now: new Date().getTime() / 1000
        }
    },
    methods: {
        /**
         * 重置密码
         */
        rePwd(row) {
            this.$confirm('确定要重置该项目的密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    let id = row.id
                    this.$util.post(this.api.projectResetPassword, { id }, (resp) => {
                        this.$alert(resp.password, '新密码')
                    })
                })
                .catch(() => {})
        },
        /**
         * 重置密码并发送邮件
         */
        rePwdEmail(row) {
            let times = row.send_email_number
            let color = times > 0 ? 'red' : '#000'
            this.$confirm(
                '确定要重置该项目的密码并发送邮件? <br/> 您已经操作过 <strong style="font-size: 20px;color: ' +
                    color +
                    ';">' +
                    times +
                    '</strong> 次了',
                '提示',
                {
                    confirmButtonText: '确定',
                    cancelButtonText: '取消',
                    type: 'warning',
                    dangerouslyUseHTMLString: true
                }
            )
                .then(() => {
                    let id = row.id
                    this.emailSending = true
                    this.$util.post(
                        this.api.projectEmail,
                        { id },
                        () => {
                            this.$message.success('邮件已发送!')
                            this.emailSending = false
                        },
                        () => {
                            this.emailSending = false
                        }
                    )
                })
                .catch(() => {})
        },
        dateFmt(second) {
            return dateFmt(second)
        }
    }
}
</script>
