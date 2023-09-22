<template>
    <div class="tool-edit container">
        <bread-crumb/>
        <el-card :header="'工具信息编辑: ' + tool_key" shadow="hover" class="tool-edit">
            <el-row :gutter="20">
                <el-col :span="16">
                    <el-form :model="form" :rules="rules" label-width="120px" label-position="left" v-loading="loading"
                             ref="form">
                        <el-form-item label="是否显示" prop="is_show">
                            <el-radio-group v-model="form.is_show">
                                <el-radio label="F">不显示</el-radio>
                                <el-radio label="T">显示</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="工具名称" prop="tool_name">
                            <el-input v-model="form.tool_name" placeholder="工具名称"></el-input>
                        </el-form-item>
                        <el-form-item label="工具介绍" prop="desc">
                            <el-input v-model="form.desc" type="textarea" :autosize="{ minRows: 3 }"></el-input>
                        </el-form-item>

                        <el-form-item label="注意事项" prop="notice">
                            <el-input v-model="form.notice" type="textarea"
                                      :autosize="{ minRows: 3 }"></el-input>
                        </el-form-item>

                        <el-form-item label="参考引用" prop="reference">
                            <el-input v-model="form.reference" type="textarea"
                                      :autosize="{ minRows: 3 }"></el-input>
                        </el-form-item>

                        <el-form-item label="方法描述" prop="method_desc">
                            <editor v-model="form.method_desc" ref="methodDescEditor"></editor>
                        </el-form-item>

                        <el-form-item label="结果说明" prop="caption">
                            <editor v-model="form.caption" ref="captionEditor"></editor>
                        </el-form-item>


                        <el-form-item label="物种相关" prop="is_species_related">
                            <el-radio-group v-model="form.is_species_related">
                                <el-radio label="F">不相关</el-radio>
                                <el-radio label="T">相关</el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="选择数限制">
                            <el-row>
                                <el-col :span="11">
                                    <el-input type="number" v-model="form.min"></el-input>
                                </el-col>
                                <el-col :span="2" style="text-align: center">-</el-col>
                                <el-col :span="11">
                                    <el-input type="number" v-model="form.max"></el-input>
                                </el-col>
                            </el-row>
                            <span class="form-item-tip">0为不限制</span>
                        </el-form-item>
                        <el-form-item label="小图标提示">
                            <el-input v-model="form.badge" placeholder="最多支持2个字"></el-input>
                            <el-radio-group v-model="form.badge">
                                <el-radio :label="item" v-for="item in badge" :key="item">
                                    {{ item || '无' }}
                                </el-radio>
                            </el-radio-group>
                        </el-form-item>
                        <el-form-item label="小图标颜色">
                            <el-color-picker v-model="form.badge_color"></el-color-picker>
                        </el-form-item>
                        <el-form-item>
                            <el-button type="primary" @click="submit" :loading="submitting">保存</el-button>
                        </el-form-item>
                    </el-form>
                </el-col>
                <el-col :span="8">
                    <div style="text-align: center">
                        <h3>图标设置</h3>
                        <img :src="icon_path" style="border: 5px solid #ddd;margin-bottom: 15px;padding: 5px;"
                             alt="icon_path"/>
                        <el-upload
                            class="upload-demo"
                            drag
                            :before-upload="beforeUpload"
                            :on-success="success"
                            v-loading="uploading"
                            :data="{ id: $route.query.id }"
                            :headers="{ Authorization: token }"
                            :action="api.toolIconUpload">
                            <i class="iconfont icon-upload"></i>
                            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
                            <template #tip>
                                <div class="el-upload__tip">只能上传{{ ext.join('/') }}文件，且不超过{{ size }}MB</div>
                            </template>
                        </el-upload>
                    </div>
                </el-col>
            </el-row>
        </el-card>
    </div>
</template>

<style>
.tool-edit {
    padding: 20px;
}
</style>

<script>
import {getSuffix} from '@/libs/functions'
import editor from '_c/editor.vue'
import image from '@img/tool.svg'
import BreadCrumb from "_c/BreadCrumb.vue";
import {getToken} from "@/libs/storage";
import api from '@/config/api'

export default {
    components: {
        BreadCrumb,
        editor
    },
    data() {
        return {
            api,
            image,
            tool_key: '',
            data_type: '',
            icon_path: '',
            badge: ['', '新', '热门', '推荐', '免费', '付费', 'Pro', '优惠', 'AI'],
            form: {
                is_show: 0,
                min: 0,
                max: 0,
                badge: '',
                badge_color: '#F52C2C',
                is_species_related: 'F',
                tool_name: '',
                desc: '',
                notice: '',
                reference: '',
                method_desc: '',
                caption: '',
            },
            rules: {
                tool_name: [
                    {required: true, message: '请输入工具名称', trigger: 'blur'}
                ],
                is_show: [
                    {required: true, message: '请选择是否显示', trigger: 'change'}
                ],
                desc: [
                    {required: true, message: '请填写工具介绍', trigger: 'blur'}
                ]
            },
            loading: false,
            uploading: false,
            submitting: false,
            ext: ['jpg', 'jpeg', 'png', 'svg'],
            size: 1, // MB
            token: getToken()
        }
    },
    methods: {
        fetchData() {
            const id = this.$route.query.id
            if (id) {
                this.loading = true
                this.$util.get(this.api.toolInfo, {id}, resp => {
                    Object.keys(this.form).map(key => {
                        this.form[key] = resp[key]
                    })
                    this.tool_key = resp.tool_key
                    this.data_type = resp.data_type
                    this.icon_path = resp.icon_path
                    this.$refs.methodDescEditor.setDefault(resp.method_desc || '')
                    this.$refs.captionEditor.setDefault(resp.caption || '')
                    this.loading = false
                }, () => {
                    this.loading = false
                })
            }
        },
        submit() {
            const id = this.$route.query.id
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true
                    this.$util.post(this.api.toolEdit, {id, ...this.form}, resp => {
                        this.$message.success('修改成功')
                        this.$router.back()
                        this.submitting = false
                    }, () => {
                        this.submitting = false
                    })
                }
            })
        },
        beforeUpload(file) {
            if (file.size > this.size * 1024 * 1024) {
                this.$message.error(`上传图片不可大于${this.size}MB`)
                return false
            }
            const ext = this.ext
            if (!ext.includes(getSuffix(file.name))) {
                this.$message.error('后缀应为' + ext.join(','))
                return false
            }
            this.uploading = true
            return true
        },
        success(resp, file) {
            this.uploading = false
            if (resp.code === 200) {
                this.icon_path = URL.createObjectURL(file.raw)
                this.$message.success(resp.message)
            } else {
                this.$message.error(resp.message)
            }
        }
    },
    created() {
        this.fetchData()
    }
}
</script>
