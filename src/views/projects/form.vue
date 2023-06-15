<template>
    <el-form :model="form" :rules="rules" label-width="120px" ref="form" label-position="left">
        <el-form-item label="项目编号:" prop="project">
            <el-input v-model="form.project" placeholder="请输入项目编号"/>
        </el-form-item>
        <el-form-item label="项目简介:" prop="description">
            <el-input v-model="form.description" placeholder="请输入项目简介" type="textarea"
                      :autosize="{ minRows: 2, maxRows: 3 }"/>
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
            <el-select v-model="form.company_id" :loading="companyLoading">
                <el-option v-for="item in company" :key="item.id" :value="item.id"
                           :label="item.name"></el-option>
            </el-select>
        </el-form-item>
        <el-form-item label="初始任务数:" prop="task_limit">
            <el-input v-model="form.task_limit" placeholder="请输入初始任务数"/>
        </el-form-item>
        <el-form-item label="联系人邮箱:" prop="email">
            <el-input v-model="form.email" placeholder="请输入联系人邮箱"/>
        </el-form-item>
        <el-form-item label="是否付费:" prop="is_paid">
            <el-radio-group v-model="form.is_paid">
                <el-radio label="F">未付费</el-radio>
                <el-radio label="T">已付费</el-radio>
            </el-radio-group>
        </el-form-item>
        <el-form-item label="截至日期:" prop="due_date">
            <el-date-picker
                v-model="form.due_date"
                type="date"
                placeholder="请选择项目截至日期"
                format="YYYY/MM/DD"
                value-format="X"
            />
        </el-form-item>
        <el-form-item>
            <el-button type="primary" @click="submitHandle" :loading="submitting">确认创建</el-button>
        </el-form-item>
    </el-form>
</template>
<script>
import {getAnnotationList, getSpeciesList} from "@/request/modules/species";
import {getCompanyList} from "@/request/modules/company";

export default {
    data() {
        return {
            form: {
                project: '',
                description: '',
                company_id: '',
                species: '0',
                annotation_library_id: '',
                email: '',
                task_limit: 9999,
                is_paid: 'F',
                due_date: Math.ceil((new Date()).getTime() / 1000) + 60 * 60 * 24 * 366
            },
            rules: {
                project: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                company_id: [
                    {required: true, message: '请填写该字段', trigger: 'blur'}
                ],
                task_limit: [
                    {required: true, message: '请填写任务数限制', trigger: 'blur'}
                ],
                email: [
                    {required: true, message: '请填写该字段', trigger: 'blur'},
                    {type: 'email', message: 'email格式不正确', trigger: 'blur'}
                ],
                species: [
                    {required: true, message: '请选择物种', trigger: 'change'}
                ],
                annotation_library_id: [
                    {required: true, message: '请选择注释库', trigger: 'change'}
                ],
                is_paid: [
                    {required: true, message: '请选择项目是否付费', trigger: 'change'}
                ],
                due_date: [
                    {required: true, message: '请选择截至日期', trigger: 'change'}
                ]
            },
            speciesLoading: false,
            speciesList: [],
            annotationLibraryLoading: false,
            annotationLibrary: [],
            companyLoading: false,
            submitting: false,
            company: []
        }
    },
    methods: {
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
        getAnnotationLibrary() {
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
        },
        fetchCompany() {
            this.companyLoading = true
            getCompanyList({}).then(resp => {
                this.company = resp
                this.companyLoading = false
            }).catch(() => {
                this.companyLoading = false
            })
        },
        submitHandle() {
            this.$refs.form.validate(valid => {
                if (valid) {
                    this.submitting = true
                    this.$emit('submit', this.form)
                } else {
                    this.submitSuccess()
                }
            })
        },
        submitSuccess() {
            this.submitting = false
        },
        setDefault(data) {
            Object.keys(this.form).map(key => {
                this.form[key] = data[key] === undefined ? '' : data[key]
            })
        }
    },
    created() {
        this.getSpeciesList()
        this.fetchCompany()
    }
}
</script>
