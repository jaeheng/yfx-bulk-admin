<template>
    <div class="accounts-create">
        <BreadCrumb/>
        <el-card shadow="hover" header="创建账号">
            <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left">
                <el-form-item label="项目编号:" prop="project">
                    <el-input v-model="form.project" placeholder="请输入项目编号"/>
                </el-form-item>
                <el-form-item label="物种:" prop="species">
                    <el-radio-group v-model="form.species" v-loading="speciesLoading" @change="getAnnotationLibrary">
                        <el-radio :label="item.id" v-for="item in speciesList" :key="item.id">{{
                                item.alias
                            }}
                        </el-radio>
                    </el-radio-group>
                </el-form-item>
                <el-form-item label="注释库:" prop="annotation_library_id">
                    <el-select v-model="form.annotation_library_id" v-loading="annotationLibraryLoading">
                        <el-option v-for="item in annotationLibrary" :key="item.id" :label="item.name"
                                   :value="item.id"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="公司:" prop="company_id">
                    <el-select v-model="form.company_id">
                        <el-option v-for="item in company" :key="item.id" :value="item.id"
                                   :label="item.company_name"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="初始任务数:" prop="allow_task_number">
                    <el-input v-model="form.allow_task_number" placeholder="请输入初始任务数"/>
                </el-form-item>
                <el-form-item label="原始文件路径:" prop="raw_path">
                    <el-input v-model="form.raw_path" placeholder="/"/>
                </el-form-item>
                <el-form-item label="联系人邮箱:" prop="email">
                    <el-input v-model="form.email" placeholder="请输入联系人邮箱"/>
                </el-form-item>
                <el-form-item label="截至日期:" prop="due_date">
                    <el-date-picker
                        v-model="form.due_date"
                        type="date"
                        placeholder="请选择账号截至日期"
                        format="YYYY/MM/DD"
                        value-format="X"
                    />
                </el-form-item>
                <el-form-item>
                    <el-button type="primary" @click="submitHandle" :loading="submitting">确认创建</el-button>
                </el-form-item>
            </el-form>
        </el-card>
    </div>
</template>

<script>
import {getAnnotationList, getSpeciesList} from "@/request/modules/species";
import BreadCrumb from "_c/BreadCrumb.vue";
import {SINGLE_CELL_DATA, SPATIAL_DATA} from "@/config/app";

export default {
    components: {BreadCrumb},
    data() {
        return {
            form: {
                project: '',
                company_id: '',
                species: '0',
                annotation_library_id: '',
                email: '',
                allow_task_number: 20,
                raw_path: '',
                due_date: Math.ceil((new Date()).getTime() / 1000) + 60 * 60 * 24 * 366
            },
            rules: {
                project: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                company_id: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                allow_task_number: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                raw_path: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                species: [
                    {required: true, message: '请选择物种', trigger: 'change'}
                ],
                annotation_library_id: [
                    {required: true, message: '请选择注释库', trigger: 'change'}
                ],
                due_date: [
                    {required: true, message: '请选择截至日期', trigger: 'change'}
                ]
            },
            submitting: false,
            company: [],
            speciesLoading: false,
            speciesList: [],
            annotationLibraryLoading: false,
            annotationLibrary: [],
            SINGLE_CELL_DATA,
            SPATIAL_DATA
        }
    },
    methods: {
        submitHandle() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    let form = this.form
                    this.submitting = true
                    this.$util.post(this.api.projectCreate, form, () => {
                        this.$router.push('/accounts')
                        this.$message.success('创建账号成功')
                        this.submitting = false
                    }, () => {
                        this.submitting = false
                    })
                }
            })
        },
        fetchCompany() {
            this.loading = true
            this.$util.get(this.api.companyList, {}, resp => {
                this.company = resp
                this.loading = false
            }, () => {
                this.loading = false
            })
        },
        getSpeciesList() {
            this.speciesLoading = true
            getSpeciesList({}).then(resp => {
                this.speciesList = resp
                this.speciesLoading = false
                if (resp[0]) {
                    this.form.species = resp[0].id
                }
                this.getAnnotationLibrary()
            }).catch(() => {
                this.speciesLoading = false
            })
        },
        getAnnotationLibrary(row) {
            this.annotationLibraryLoading = true
            getAnnotationList({species_id: this.form.species}).then(resp => {
                this.annotationLibrary = resp
                this.annotationLibraryLoading = false
                if (resp[0]) {
                    this.form.annotation_library_id = resp[0].id
                } else {
                    this.form.annotation_library_id = ''
                }
            }).catch(() => {
                this.annotationLibraryLoading = false
            })
        }
    },
    created() {
        this.fetchCompany()
        this.getSpeciesList()
    }
}
</script>
