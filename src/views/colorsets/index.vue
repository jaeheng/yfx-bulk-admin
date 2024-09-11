<template>
    <Layout class="color-sets">
        <PageHeader
            description="颜色集配置，可管理多组颜色集合供用户选择"
            :has-bread="true"
            :image="image"
        />
        <el-card shadow="never">
            <el-form inline>
                <el-form-item style="margin-bottom: 0">
                    <el-button type="primary" @click="openDrawer()">新建颜色集</el-button>
                </el-form-item>
            </el-form>
        </el-card>
        <ul class="color-list">
            <li v-for="item in list" :key="item.id">
                <div class="info">
                    <h3>
                        {{ item.name }}
                        <span v-if="item.default === 'T'" style="font-size: 13px; color: #4daf4a"
                            >（默认）</span
                        >
                    </h3>
                    <div class="btns">
                        <el-button type="primary" size="small" plain @click="openDrawer(item)"
                            >编辑
                        </el-button>
                        <el-button type="danger" size="small" plain @click="deleteColorSet(item)"
                            >删除
                        </el-button>
                    </div>
                </div>
                <div class="colors">
                    <span v-for="color in item.color" :key="color" :style="{ background: color }">{{
                        color.toUpperCase()
                    }}</span>
                </div>
            </li>
        </ul>

        <el-skeleton v-if="loading" />

        <el-empty description="暂无颜色集" v-if="list.length === 0"></el-empty>

        <el-drawer :title="drawerTitle" v-model="drawer" :size="500" direction="rtl">
            <el-form
                label-position="top"
                ref="form"
                :model="form"
                style="padding: 30px"
                :rules="rules"
            >
                <el-form-item label="名称" prop="name">
                    <el-input v-model="form.name" placeholder="请输入颜色集名称"></el-input>
                </el-form-item>
                <el-form-item label="是否默认" prop="default">
                    <el-radio-group v-model="form.default">
                        <el-radio label="F">否</el-radio>
                        <el-radio label="T">是</el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="颜色集" prop="color">
                    <el-input
                        v-model="form.color"
                        placeholder="颜色值之间用回车或英文逗号隔开"
                        type="textarea"
                        :autosize="{ minRows: 5, maxRows: 10 }"
                    ></el-input>
                </el-form-item>
                <el-form-item label="颜色预览">
                    <color-bar :colors="colorExplode" size="small"></color-bar>
                    <p style="margin-top: 0">共{{ colorExplode.length }}个可用颜色值</p>
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submit" :loading="submitting">保存</el-button>
                    <el-button @click="close">取消</el-button>
                </el-form-item>
            </el-form>
        </el-drawer>
    </Layout>
</template>
<style lang="scss">
.color-list {
    padding: 0 0 50px 0;

    li {
        padding: 20px;
        display: block;
        border: 1px solid #eee;
        position: relative;
        margin-bottom: 15px;
        background: #fff;
        border-radius: 4px;

        &:hover {
            box-shadow: 0 3px 10px -3px rgba(0, 0, 0, 0.1);
        }
    }

    .info {
        display: flex;
        padding: 15px 0 30px;
        justify-content: space-between;
    }

    h3 {
        color: #363636;
        font-weight: normal;
        margin-top: 0;
        margin-bottom: 0;
        display: inline-block;
    }

    .colors {
        width: 100%;
        z-index: 2;

        span {
            display: inline-block;
            width: 10%;
            transition: all 0.3s;
            padding: 8px 10px;
            color: #eee;
            text-shadow: 0 1px 1px rgba(0, 0, 0, 0.2);
            font-size: 12px;
            text-align: center;
            box-sizing: border-box;

            &:hover {
                transform: scale(1.5);
            }
        }
    }

    .btns {
        float: right;
    }
}
</style>
<script>
import { checkHex } from '@/libs/functions'
import ColorBar from '_c/ColorBar.vue'
import PageHeader from '_c/PageHeader.vue'
import image from '@img/colorsets2.png'
import Layout from '_v/layouts/layout.vue'

export default {
    components: {
        ColorBar,
        PageHeader,
        Layout
    },
    data() {
        const checkColorValidate = (rule, value, callback) => {
            if (this.colorExplode.length === 0) {
                callback(new Error('没有有效的颜色值'))
            } else {
                callback()
            }
        }
        return {
            image,
            list: [],
            form: {
                id: 0,
                color: '',
                name: '',
                default: 'F'
            },
            rules: {
                name: [{ required: true, message: '请输入颜色集名称', trigger: 'blur' }],
                default: [{ required: true, message: '请选择是否默认', trigger: 'change' }],
                color: [
                    { required: true, message: '请输入颜色值', trigger: 'blur' },
                    { validator: checkColorValidate, trigger: 'blur' }
                ]
            },
            loading: false,
            submitting: false,
            drawer: false
        }
    },
    computed: {
        drawerTitle() {
            return this.form.id ? '编辑颜色集' : '新建颜色集'
        },
        colorExplode() {
            let arr = this.form.color.replaceAll('\n', ',').split(',')
            return arr.filter((item) => {
                return checkHex(item.trim())
            })
        }
    },
    methods: {
        fetchData() {
            this.loading = true
            this.$util.get(
                this.api.colorSetList,
                {},
                (resp) => {
                    this.list = resp
                    this.loading = false
                },
                () => {
                    this.loading = false
                }
            )
        },
        openDrawer(row) {
            if (row) {
                this.form.id = row.id
                this.form.color = row.color.join(',')
                this.form.name = row.name
                this.form.default = row.default
            } else {
                this.form.id = 0
                this.form.color = ''
                this.form.name = ''
                this.form.default = 'F'
            }
            this.drawer = true
        },
        close() {
            this.drawer = false
        },
        submit() {
            const id = this.form.id
            const name = this.form.name
            const isDefault = this.form.default
            const color = this.colorExplode
            const api = id ? this.api.editColorSet : this.api.addColorSet
            this.$refs.form.validate((valid) => {
                if (valid) {
                    this.submitting = true
                    this.$util.post(
                        api,
                        { id, name, color, default: isDefault },
                        (resp) => {
                            this.$message.success('保存成功')
                            this.fetchData()
                            this.submitting = false
                            this.close()
                        },
                        () => {
                            this.submitting = false
                        }
                    )
                }
            })
        },
        deleteColorSet(row) {
            let id = row.id
            let title = row.name
            this.$confirm(`确定删除 ${title}?`, '提示', {
                confirmButtonText: '确定',
                cancelButtonText: '取消',
                type: 'warning'
            })
                .then(() => {
                    this.$util.post(this.api.deleteColorSet, { id }, (resp) => {
                        this.$message.success('删除成功')
                        this.fetchData()
                    })
                })
                .catch(() => {})
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
