<template>
    <div class="annotation">
        <div class="category-list" v-loading="loading">
            <el-card shadow="never" class="category-item" v-for="item in annotation" :key="item.id">
                <div style="padding: 14px">
                    <h3>{{ item.name }}</h3>
                    <div class="info">
                        <div class="flex"><span class="label">ID:</span> {{ item.id }}</div>
                        <div class="flex">
                            <span class="label">维护者:</span> {{ item.maintainer }}
                        </div>
                        <div class="flex">
                            <span class="label">创建时间:</span> {{ item.created_at }}
                        </div>
                        <div class="flex">
                            <span class="label">更新时间:</span> {{ item.updated_at }}
                        </div>
                        <div class="flex">
                            <span class="label">描述:</span> {{ item.description }}
                        </div>
                        <div class="flex">
                            <span class="label">存储目录:</span>
                            <code>{{ item.library_path }}</code>
                        </div>
                    </div>
                </div>
                <div class="bottom clearfix">
                    <div class="button" @click="$refs.json.show(item)">详细信息</div>
                    <div class="button" @click="$refs.create.show(species_id, item)">编辑</div>
                </div>
            </el-card>
        </div>

        <DatabaseJson ref="json"></DatabaseJson>
        <AnnotationCreate ref="create" @success="success"></AnnotationCreate>
    </div>
</template>
<style lang="scss">
.annotation {
    padding-top: 20px;

    .category-item {
        margin-bottom: 10px;
        width: 300px;

        .info {
            font-size: 12px;

            span {
                display: inline-block;
                width: 60px;
                text-align: right;
                flex-shrink: 0;
            }
        }
    }
}
</style>
<script>
import DatabaseJson from './databaseJson.vue'
import AnnotationCreate from './annotationCreate.vue'
import { ANNOTATION_PREFIX } from '@/config/app'

export default {
    emits: ['success'],
    props: {
        annotation: {
            type: Array,
            required: true,
            default: () => {
                return []
            }
        },
        species_id: {
            type: Number,
            required: true
        }
    },
    components: {
        DatabaseJson,
        AnnotationCreate
    },
    data() {
        return {
            loading: false,
            ANNOTATION_PREFIX
        }
    },
    methods: {
        success() {
            this.$emit('success')
        }
    }
}
</script>
