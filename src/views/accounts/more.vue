<template>
  <span>
    <el-button circle plain size="small" @click="visible = true"><i class="iconfont icon-more"></i></el-button>
    <el-dialog
        v-model="visible"
        append-to-body
        title="账号详情"
        width="1300px">
      <el-row :gutter="20">
        <el-col :span="14">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="状态">
              <import-state :state="data.state">{{ data.state === 1 ? '可用' : '已禁用' }}</import-state>
            </el-descriptions-item>
            <el-descriptions-item label="项目名称">{{ data.username }}</el-descriptions-item>
            <el-descriptions-item label="截至日期">
              <el-link
                  :underline="false"
                  :type="data.due_date - now > 0 ? 'default' : 'danger'">
                    {{ dateFmt(data.due_date) }}
                    {{ data.due_date - now > 0 ? '' : '(已过期)' }}</el-link>
            </el-descriptions-item>
            <el-descriptions-item label="发邮次数">{{ data.send_email_number }}</el-descriptions-item>
            <el-descriptions-item label="剩余任务数">{{ data.task_limit }}</el-descriptions-item>
            <el-descriptions-item label="原始文件路径">
              <div style="word-break: break-all">
                {{ data.raw_path }}
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="所属公司">{{ data.company.company_name }}</el-descriptions-item>
            <el-descriptions-item label="联系人邮箱">{{ data.email }}</el-descriptions-item>
            <el-descriptions-item label="样本路径">{{ data.sample_path }}</el-descriptions-item>
            <el-descriptions-item label="账号绑定">
              <el-table :data="data.user_bind" :border="true">
                <el-table-column label="ID" prop="id" width="80"></el-table-column>
                <el-table-column label="单细胞账号" prop="sc_project.project"></el-table-column>
                <el-table-column label="空间账号" prop="st_project.project"></el-table-column>
              </el-table>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
        <el-col :span="10">
          <el-descriptions :column="1" border>
            <el-descriptions-item label="报告查看">
              <div style="white-space: nowrap;">
                <a v-if="data.single_report" :href="data.single_report" style="margin-right: 10px;" target="_blank">
                  <el-button size="small" type="primary">单样本</el-button>
                </a>
                <el-button v-else disabled size="small" type="primary">单样本</el-button>

                <a v-if="data.multiple_report" :href="data.multiple_report" style="margin-right: 10px;" target="_blank">
                  <el-button size="small" type="warning">多样本</el-button>
                </a>
                <el-button v-else disabled size="small" type="warning">多样本</el-button>

                <a v-if="data.report_path" :href="data.report_path" target="_blank">
                  <el-button size="small" type="warning">打包下载</el-button>
                </a>
                <el-button v-else disabled size="small" type="warning">打包下载</el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="慎重操作">
              <div style="white-space: nowrap;">
                <el-button size="small" type="danger" @click="rePwd(data)">重置密码</el-button>
                <el-button
                    v-if="data.import_state === 1"
                    :loading="emailSending"
                    size="small"
                    type="danger"
                    @click="rePwdEmail(data)">重置密码并发送邮件</el-button>
              </div>
            </el-descriptions-item>
            <el-descriptions-item label="数据导入">
              <div style="display: flex;justify-content: space-between;">
                <el-button size="small" type="success" @click="reImport(data)">导入数据</el-button>
                <div><import-state :state="data.import_state"></import-state></div>
              </div>
            </el-descriptions-item>
          </el-descriptions>
        </el-col>
      </el-row>

    </el-dialog>
  </span>
</template>

<script>
import {SINGLE_CELL_DATA, SPATIAL_DATA} from "@/config/app";
import {dateFmt} from "@/libs/functions";
import ImportState from "_c/ImportState.vue";

export default {
    props: ['data'],
    emits: ['freshData'],
    components: {
        ImportState
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
            this.$confirm('确定要重置该账号的密码?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let id = row.id
                this.$util.post(this.api.projectResetPassword, {id}, resp => {
                    this.$alert(resp.password, '新密码')
                })
            }).catch(() => {
            })
        },
        /**
         * 重置密码并发送邮件
         */
        rePwdEmail(row) {
            let times = row.send_email_number
            let color = times > 0 ? 'red' : '#000'
            this.$confirm('确定要重置该账号的密码并发送邮件? <br/> 您已经操作过 <strong style="font-size: 20px;color: ' + color + ';">' + times + '</strong> 次了', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning',
                dangerouslyUseHTMLString: true
            }).then(() => {
                let id = row.id
                this.emailSending = true
                this.$util.post(this.api.projectEmail, {id}, () => {
                    this.$message.success('邮件已发送!')
                    this.emailSending = false
                }, () => {
                    this.emailSending = false
                })
            }).catch(() => {
            })
        },
        /**
         * 重新导入
         * @param row
         */
        reImport(row) {
            this.$confirm('确定要重新导入该账号数据?', '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            }).then(() => {
                let id = row.id
                this.$util.post(this.api.projectImport, {id}, () => {
                    this.$message.success('操作成功')
                    this.$emit('freshData')
                    this.visible = false
                })
            }).catch(() => {
            })
        },
        dateFmt(second) {
            return dateFmt(second)
        }
    }
}
</script>
