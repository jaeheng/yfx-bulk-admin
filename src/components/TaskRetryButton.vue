<template>
  <el-button type="warning" @click="retry" :loading="loading" size="small" round>重启</el-button>
</template>

<script setup>
import { retryTask } from '@/request/modules/task'
import { ref } from 'vue'
import { ElMessageBox, ElNotification } from 'element-plus'

const loading = ref(false)
const props = defineProps({
  id: {
    type: Number,
    default: 0
  }
})

const emits = defineEmits(['success'])
const retry = () => {
  if (props.id > 0) {
    ElMessageBox.confirm('确定要重启该任务?', 'Warning', {
      confirmButtonText: '确定',
      cancelButtonText: '取消',
      type: 'warning'
    })
      .then(() => {
        loading.value = true
        retryTask(props.id)
          .then((resp) => {
            console.log(resp)
            ElNotification.success({
              title: '任务重启成功',
              message: '可在稍后检查任务的运行状态'
            })
            loading.value = false
            emits('success', props.id)
          })
          .catch(() => {
            loading.value = false
          })
      })
      .catch(() => {})
  }
}
</script>
